// src/app/api/payment/webhook/route.ts
// IPN (Instant Payment Notification) PayDunya
// Le hash = SHA-512 de la MASTER_KEY — calculé par PayDunya, vérifié par nous

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/core/db/prisma';
import { PaymentStatus } from '@/generated/prisma/client';
import { verifyWebhookHash } from '@/core/services/softpay.service';

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);

    if (!body) {
        return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    // Log complet pour debug (à retirer en prod)
    console.log('[webhook] Payload:', JSON.stringify(body, null, 2));

    // --- Vérification du hash ---
    // PayDunya envoie : data.hash = SHA512(MASTER_KEY)
    // Uniquement en production — sandbox n'envoie pas de hash
    if (process.env.PAYDUNYA_MODE === 'live') {
        const receivedHash: string | undefined = body?.data?.hash;

        if (!receivedHash || !verifyWebhookHash(receivedHash)) {
            console.warn('[webhook] Hash invalide:', receivedHash);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
    }

    // --- Extraire les données ---
    // Structure PayDunya IPN :
    // {
    //   data: {
    //     hash: "sha512...",
    //     invoice: { token, status, total_amount },
    //     custom_data: { internal_ref, customer_name, customer_email },
    //     customer: { name, phone, email }
    //   }
    // }
    const token:       string | undefined = body?.data?.invoice?.token;
    const rawStatus:   string | undefined = body?.data?.invoice?.status;
    const internalRef: string | undefined = body?.data?.custom_data?.internal_ref;

    if (!token && !internalRef) {
        console.warn('[webhook] Aucun identifiant trouvé dans le payload');
        // Retourner 200 pour stopper les retries PayDunya
        return NextResponse.json({ received: true });
    }

    // --- Mapper statut PayDunya → PaymentStatus Prisma ---
    const statusMap: Record<string, PaymentStatus> = {
        completed: PaymentStatus.SUCCESS,
        pending:   PaymentStatus.PENDING,
        cancelled: PaymentStatus.FAILED,
        failed:    PaymentStatus.FAILED,
    };

    const newStatus = statusMap[rawStatus ?? ''] ?? PaymentStatus.PENDING;

    try {
        // Chercher par providerRef (token PayDunya) en priorité, sinon par internalRef
        const where = token
            ? { providerRef: token }
            : { internalRef: internalRef! };

        const updated = await prisma.payment.updateMany({
            where,
            data: {
                status: newStatus,
                ...(newStatus === PaymentStatus.FAILED && {
                    errorMessage: `PayDunya: ${rawStatus}`,
                }),
            },
        });

        if (updated.count === 0) {
            console.warn(`[webhook] Paiement introuvable — token: ${token ?? 'N/A'}, ref: ${internalRef ?? 'N/A'}`);
        } else {
            console.log(`[webhook] ✅ Payment → ${newStatus} (token: ${token ?? internalRef})`);
        }

        // Toujours HTTP 200 pour stopper les retries PayDunya
        return NextResponse.json({ received: true });

    } catch (err) {
        console.error('[webhook] DB error:', err);
        // Retourner 200 quand même — une erreur DB ne doit pas déclencher des retries PayDunya
        return NextResponse.json({ received: true });
    }
}