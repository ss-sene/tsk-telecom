// core/services/wave.service.ts
// Wave Checkout API
//
// Flow :
// 1. POST /v1/checkout/sessions → wave_launch_url + session id
// 2. Rediriger le client vers wave_launch_url :
//    - Mobile avec Wave installé → ouvre l'app directement
//    - Mobile sans Wave          → invite à télécharger l'app
//    - Desktop                   → QR code à scanner avec l'app Wave
// 3. Le client confirme dans l'app Wave
// 4. Wave POSTe checkout.session.completed sur notre webhook
// 5. En fallback, la page succès peut vérifier via GET /v1/checkout/sessions/:id
//
// Env vars requises :
//   WAVE_API_KEY        — clé Bearer (Wave Business Dashboard → API Keys)
//   WAVE_SIGNING_SECRET — secret HMAC-SHA256 pour signer les requêtes sortantes (Wave Dashboard → API Keys)
//   WAVE_WEBHOOK_SECRET — secret HMAC-SHA256 pour vérifier les webhooks entrants (Wave Dashboard → Webhooks)

import { createHmac, timingSafeEqual } from 'crypto';

const WAVE_API_BASE = 'https://api.wave.com';

// ── Types ────────────────────────────────────────────────────────────────────

export interface CreateWaveCheckoutSessionParams {
    amount:      number;  // en XOF (entier)
    internalRef: string;  // client_reference — identifiant interne du paiement
    successUrl:  string;  // URL Wave redirige après paiement confirmé
    errorUrl:    string;  // URL Wave redirige après annulation ou échec
}

export type CreateWaveCheckoutSessionResult =
    | { success: true;  waveUrl: string; sessionId: string }
    | { success: false; message: string };

// ── Créer une session de paiement Wave ───────────────────────────────────────

export async function createWaveCheckoutSession(
    params: CreateWaveCheckoutSessionParams,
): Promise<CreateWaveCheckoutSessionResult> {
    const apiKey        = process.env.WAVE_API_KEY;
    const signingSecret = process.env.WAVE_SIGNING_SECRET;

    if (!apiKey) {
        return { success: false, message: 'WAVE_API_KEY non configuré' };
    }
    if (!signingSecret) {
        return { success: false, message: 'WAVE_SIGNING_SECRET non configuré' };
    }

    // Build body once — the same string is signed and sent to guarantee integrity
    const body = JSON.stringify({
        amount:           String(params.amount),  // Wave attend une chaîne
        currency:         'XOF',
        client_reference: params.internalRef,
        success_url:      params.successUrl,
        error_url:        params.errorUrl,
    });

    const timestamp     = Math.floor(Date.now() / 1000);
    const signature     = createHmac('sha256', signingSecret)
        .update(String(timestamp) + body)
        .digest('hex');
    const waveSignature = `t=${timestamp},v1=${signature}`;

    try {
        const res = await fetch(`${WAVE_API_BASE}/v1/checkout/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type':   'application/json',
                'Authorization':  `Bearer ${apiKey}`,
                'Wave-Signature': waveSignature,
            },
            body,
            signal: AbortSignal.timeout(15_000),
        });

        const data = await res.json() as { wave_launch_url?: string; id?: string; message?: string };

        if (!res.ok || !data.wave_launch_url || !data.id) {
            return {
                success: false,
                message: data.message ?? `Wave API erreur ${res.status}`,
            };
        }

        return {
            success:   true,
            waveUrl:   data.wave_launch_url,
            sessionId: data.id,
        };
    } catch (err) {
        console.error('[wave] createCheckoutSession error:', err);
        return { success: false, message: 'Erreur réseau Wave' };
    }
}

// ── Vérification de signature webhook ────────────────────────────────────────
// Wave signe chaque requête avec :
//   Authorization: Wave {timestamp}.{hmac_sha256(WAVE_WEBHOOK_SECRET, `${timestamp}.${rawBody}`)}

export function verifyWaveWebhookSignature(
    authHeader: string,
    rawBody:    string,
): boolean {
    try {
        const token     = authHeader.replace(/^Wave\s+/i, '');
        const dotIdx    = token.indexOf('.');
        const timestamp = token.slice(0, dotIdx);
        const signature = token.slice(dotIdx + 1);

        const expected = createHmac('sha256', process.env.WAVE_WEBHOOK_SECRET!)
            .update(`${timestamp}.${rawBody}`)
            .digest('hex');

        return timingSafeEqual(
            Buffer.from(signature, 'hex'),
            Buffer.from(expected,  'hex'),
        );
    } catch {
        return false;
    }
}

// ── Type du payload webhook Wave ─────────────────────────────────────────────

export interface WaveWebhookPayload {
    type: string;
    data: {
        id:               string;
        client_reference: string;
        payment_status:   'succeeded' | 'cancelled' | 'processing';
        amount:           string;
        currency:         string;
    };
}
