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

// ── Vérification de signature webhook (stratégie SIGNING_SECRET) ─────────────
// Wave envoie le header : Wave-Signature: t={timestamp},v1={hmac_sha256}
// Le payload signé est : `${timestamp}${rawBody}` (sans séparateur)
// Même algorithme que la signature des requêtes sortantes.

export function verifyWaveWebhookSignature(
    waveSignatureHeader: string,
    rawBody:             string,
): boolean {
    try {
        const secret = process.env.WAVE_WEBHOOK_SECRET;
        if (!secret) return false;

        // Parse "t={timestamp},v1={signature}"
        const parts     = Object.fromEntries(
            waveSignatureHeader.split(',').map(p => p.split('=')),
        ) as Record<string, string>;
        const timestamp = parts['t'];
        const signature = parts['v1'];

        if (!timestamp || !signature) return false;

        const expected = createHmac('sha256', secret)
            .update(timestamp + rawBody)
            .digest('hex');

        return timingSafeEqual(
            Buffer.from(signature, 'hex'),
            Buffer.from(expected,  'hex'),
        );
    } catch {
        return false;
    }
}

// ── Types des payloads webhook Wave ──────────────────────────────────────────
//
// checkout.session.completed     — paiement confirmé via session Checkout
// checkout.session.payment_failed — paiement échoué ou session expirée
// merchant.payment_received      — paiement direct au marchand (hors Checkout)
//   → client_reference optionnel : absent si le client n'a pas utilisé le lien de session

export interface WaveCheckoutEventPayload {
    type: 'checkout.session.completed' | 'checkout.session.payment_failed';
    data: {
        id:               string;   // ID de session Wave (cos_xxx)
        client_reference: string;   // internalRef de notre Payment
        payment_status:   'succeeded' | 'cancelled' | 'processing' | 'failed';
        amount:           string;
        currency:         string;
    };
}

export interface WaveMerchantPaymentPayload {
    type: 'merchant.payment_received';
    data: {
        id:                string;   // ID de transaction Wave (pay_xxx)
        client_reference?: string;   // présent uniquement si lié à une session Checkout
        amount:            string;
        currency:          string;
    };
}

export type WaveWebhookPayload =
    | WaveCheckoutEventPayload
    | WaveMerchantPaymentPayload;
