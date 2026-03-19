import { NextResponse } from 'next/server';
import { prisma } from '@/core/db/prisma';
import { PaymentStatus } from '@/generated/prisma/client';
import { z } from 'zod';
import crypto from 'crypto';
import { WebhookPayloadSchema } from '@/core/validators/webhook.schema';

// --- HELPER : VÉRIFICATION DE SIGNATURE (HMAC-SHA256) ---
function verifySignature(payload: string, signature: string | null): boolean {
    const secret = process.env.WEBHOOK_SECRET;
    if (!signature || !secret) return false;

    // Recalcul du hash attendu à partir du corps brut
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    // Comparaison en temps constant (Atténuation des attaques par timing)
    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
    );
}

// --- HANDLER POST (Serverless Function) ---
export async function POST(req: Request) {
    try {
        // 1. Extraction du corps brut (Nécessaire pour le calcul cryptographique)
        const rawBody = await req.text();

        // Header standard (varie selon l'opérateur : x-wave-signature, x-orange-signature, etc.)
        const signature = req.headers.get('x-provider-signature');

        // 2. Sécurité Périmétrique
        if (process.env.NODE_ENV === 'production' && !verifySignature(rawBody, signature)) {
            console.warn('[WEBHOOK_AUTH_FAILED] Tentative de spoofing bloquée.');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 3. Parsing et Validation Spatiale (Zod)
        const parsedData = WebhookPayloadSchema.safeParse(JSON.parse(rawBody));
        if (!parsedData.success) {
            console.error('[WEBHOOK_VALIDATION_ERROR]', z.treeifyError(parsedData.error));
            return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
        }

        const { internalRef, status } = parsedData.data;

        // Détermination du statut Prisma
        const finalStatus = status === 'SUCCESS' ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;

        // 4. Exécution Atomique & Idempotente (Complexité O(1))
        // Le `updateMany` est crucial : il ne crashe pas si l'enregistrement n'existe pas,
        // et la condition `status : PENDING` garantit que l'on ne traite la requête qu'une seule fois.
        const result = await prisma.payment.updateMany({
            where: {
                internalRef: internalRef,
                status: PaymentStatus.PENDING,
            },
            data: {
                status: finalStatus,
            },
        });

        if (result.count === 0) {
            // Transaction introuvable ou DÉJÀ traitée (Idempotence respectée)
            console.info(`[WEBHOOK_IGNORED] Transaction déjà traitée ou inexistante : ${internalRef}`);
        } else {
            console.info(`[WEBHOOK_SUCCESS] Transaction ${internalRef} mise à jour -> ${finalStatus}`);
            // TODO: Déclencher les Side-Effects asynchrones ici (ex: Provisioning Box, Envoi SMS)
        }

        // 5. Acquittement Opérateur
        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error) {
        console.error('[WEBHOOK_CRITICAL_ERROR]', error);
        // Toujours retourner 500 pour que l'opérateur planifie un Retry
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}