// api/payment/webhooks/wave/route.ts
// IPN Wave — reçoit les notifications de paiement Wave Checkout
//
// ⚠️  Configurer cette URL dans le dashboard Wave Business :
//      Settings → Webhooks → https://{domaine}/api/payment/webhooks/wave
//
// Sécurité : Wave signe le body avec HMAC-SHA256 (WAVE_WEBHOOK_SECRET)
// Header reçu : Authorization: Wave {timestamp}.{signature}
//
// Événements gérés :
//   checkout.session.completed      → met à jour le statut selon payment_status
//   checkout.session.payment_failed → force FAILED
//   merchant.payment_received       → force SUCCESS si client_reference connu

import { NextRequest, NextResponse }                   from 'next/server';
import { prisma }                                       from '@/core/db/prisma';
import { PaymentStatus }                               from '@/generated/prisma/client';
import { verifyWaveWebhookSignature }                  from '@/core/services/wave.service';
import type { WaveWebhookPayload }                     from '@/core/services/wave.service';

// Mapping payment_status Wave → PaymentStatus Prisma (événements Checkout)
const CHECKOUT_STATUS_MAP: Record<string, PaymentStatus> = {
    succeeded:  PaymentStatus.SUCCESS,
    processing: PaymentStatus.PENDING,
    cancelled:  PaymentStatus.FAILED,
    failed:     PaymentStatus.FAILED,
};

// Met à jour le paiement en base pour les événements Checkout (providerRef = session ID)
async function applyCheckoutStatusUpdate(
    internalRef:  string,
    sessionId:    string,
    newStatus:    PaymentStatus,
    errorMessage?: string,
): Promise<void> {
    const updated = await prisma.payment.updateMany({
        where: {
            internalRef,
            // Guard : on ne régresse jamais un paiement déjà finalisé
            status: { notIn: [PaymentStatus.SUCCESS, PaymentStatus.REFUNDED] },
        },
        data: {
            status:      newStatus,
            providerRef: sessionId,
            ...(errorMessage ? { errorMessage } : {}),
        },
    });

    if (updated.count === 0) {
        console.warn('[webhook/wave] Paiement introuvable ou déjà finalisé — ref:', internalRef);
    } else {
        console.log(`[webhook/wave] ✅ Payment ${internalRef} → ${newStatus}`);
    }
}

export async function POST(req: NextRequest) {
    const rawBody = await req.text();

    // --- Vérification de la signature (SIGNING_SECRET) ---
    // Wave envoie : Wave-Signature: t={timestamp},v1={hmac_sha256}
    const waveSignature = req.headers.get('wave-signature') ?? '';
    if (!waveSignature || !verifyWaveWebhookSignature(waveSignature, rawBody)) {
        console.warn('[webhook/wave] Signature invalide — rejetée');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // --- Parsing du payload ---
    let payload: WaveWebhookPayload;
    try {
        payload = JSON.parse(rawBody) as WaveWebhookPayload;
    } catch {
        console.warn('[webhook/wave] Body JSON invalide');
        return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
    }

    console.log('[webhook/wave] event reçu:', payload.type);

    try {
        // ── checkout.session.completed ──────────────────────────────────────────
        if (payload.type === 'checkout.session.completed') {
            const { id: sessionId, client_reference: internalRef, payment_status } = payload.data;

            console.log('[webhook/wave]', payload.type, '| ref:', internalRef, '| status:', payment_status);

            const newStatus    = CHECKOUT_STATUS_MAP[payment_status] ?? PaymentStatus.PENDING;
            const errorMessage = newStatus === PaymentStatus.FAILED
                ? `Wave: ${payment_status}`
                : undefined;

            await applyCheckoutStatusUpdate(internalRef, sessionId, newStatus, errorMessage);
            return NextResponse.json({ received: true });
        }

        // ── checkout.session.payment_failed ────────────────────────────────────
        if (payload.type === 'checkout.session.payment_failed') {
            const { id: sessionId, client_reference: internalRef, payment_status } = payload.data;

            console.log('[webhook/wave]', payload.type, '| ref:', internalRef, '| status:', payment_status);

            await applyCheckoutStatusUpdate(
                internalRef,
                sessionId,
                PaymentStatus.FAILED,
                `Wave: ${payload.type}`,
            );
            return NextResponse.json({ received: true });
        }

        // ── merchant.payment_received ───────────────────────────────────────────
        // Paiement direct au marchand — peut arriver hors session Checkout.
        // On ne met à jour que le statut (pas providerRef : la session ID reste
        // la référence canonique dans notre système).
        if (payload.type === 'merchant.payment_received') {
            const { client_reference: internalRef } = payload.data;

            if (!internalRef) {
                console.log('[webhook/wave] merchant.payment_received sans client_reference — ignoré');
                return NextResponse.json({ received: true });
            }

            console.log('[webhook/wave] merchant.payment_received | ref:', internalRef);

            const updated = await prisma.payment.updateMany({
                where: {
                    internalRef,
                    status: { notIn: [PaymentStatus.SUCCESS, PaymentStatus.REFUNDED] },
                },
                data: { status: PaymentStatus.SUCCESS },
            });

            if (updated.count === 0) {
                console.warn('[webhook/wave] Paiement introuvable ou déjà finalisé — ref:', internalRef);
            } else {
                console.log(`[webhook/wave] ✅ Payment ${internalRef} → SUCCESS (merchant.payment_received)`);
            }

            return NextResponse.json({ received: true });
        }

        // Événement non géré — on répond 200 pour éviter les retries Wave
        console.log('[webhook/wave] Événement non géré — ignoré:', (payload as { type: string }).type);
        return NextResponse.json({ received: true });

    } catch (err) {
        console.error('[webhook/wave] DB error:', err);
        // 200 pour éviter les retries Wave sur une erreur DB transitoire
        return NextResponse.json({ received: true });
    }
}
