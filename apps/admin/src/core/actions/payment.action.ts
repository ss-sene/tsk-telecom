// core/actions/payment.action.ts
'use server';

import { prisma }                          from '@/core/db/prisma';
import { InitiatePaymentSchema }           from '@/core/validators/payment.schema';
import { createWaveCheckoutSession }        from '@/core/services/wave.service';
import { createOrangeMoneyPayment }        from '@/core/services/orange-money.service';
import { TDK_PLANS_ARRAY }                 from '@tdk/config';
import '@/lib/env'; // validates required env vars at startup

export async function initiatePayment(payload: unknown) {
    // --- 1. Validation ---
    const parsedData = InitiatePaymentSchema.safeParse(payload);
    if (!parsedData.success) {
        console.error('[VALIDATION_ERROR]', parsedData.error.issues);
        return { success: false, error: 'Données invalides. Veuillez vérifier le formulaire.' };
    }

    const dto = parsedData.data;

    // --- Validation du montant côté serveur (anti-tampering) ---
    const KNOWN_PRICES = new Set<number>(TDK_PLANS_ARRAY.map(p => p.price));
    if (!KNOWN_PRICES.has(dto.amount)) {
        return { success: false, error: 'Offre sélectionnée invalide ou expirée.' };
    }

    const cleanEmail = dto.email?.trim() || null;
    const appUrl     = process.env.NEXT_PUBLIC_APP_URL ?? '';

    try {
        // --- 2. Résolution du village (hors transaction — upsert idempotent) ---
        let finalVillageId = dto.villageId;

        if (dto.villageId === 'OTHER' && dto.newVillageName) {
            const cleanName = dto.newVillageName.trim().charAt(0).toUpperCase()
                + dto.newVillageName.trim().slice(1).toLowerCase();

            const village = await prisma.village.upsert({
                where:  { titre: cleanName },
                update: {},
                create: { titre: cleanName },
            });

            finalVillageId = village.id;
        }

        // --- 3 & 4. Client upsert + Payment create in a single transaction ---
        const { client, payment } = await prisma.$transaction(async (tx) => {
            const c = await tx.client.upsert({
                where:  { phone: dto.phone },
                update: {
                    firstName: dto.firstName,
                    lastName:  dto.lastName,
                    villageId: finalVillageId,
                    ...(cleanEmail ? { email: cleanEmail } : {}),
                },
                create: {
                    phone:     dto.phone,
                    firstName: dto.firstName,
                    lastName:  dto.lastName,
                    villageId: finalVillageId,
                    ...(cleanEmail ? { email: cleanEmail } : {}),
                },
            });

            const p = await tx.payment.create({
                data: {
                    amount:   dto.amount,
                    provider: dto.provider,
                    clientId: c.id,
                },
            });

            return { client: c, payment: p };
        });

        void client; // referenced to satisfy TS — client is used implicitly via payment.clientId

        const successUrl = `${appUrl}/payment/success?ref=${payment.internalRef}`;
        const cancelUrl  = `${appUrl}/checkout?cancelled=1`;

        // --- 5. Appel selon l'opérateur ---
        if (dto.provider === 'WAVE') {
            const result = await createWaveCheckoutSession({
                amount:      dto.amount,
                internalRef: payment.internalRef,
                successUrl:  successUrl,
                errorUrl:    cancelUrl,
            });

            if (!result.success) {
                await prisma.payment.update({
                    where: { id: payment.id },
                    data:  { status: 'FAILED', errorMessage: result.message },
                });
                return { success: false, error: result.message };
            }

            await prisma.payment.update({
                where: { id: payment.id },
                data:  { providerRef: result.sessionId },
            });

            return {
                success:     true,
                checkoutUrl: result.waveUrl,
                internalRef: payment.internalRef,
                provider:    'WAVE' as const,
            };
        }

        // --- Orange Money ---
        const result = await createOrangeMoneyPayment({
            amount:      dto.amount,
            internalRef: payment.internalRef,
            notifUrl:    `${appUrl}/api/payment/webhooks/orange-money`,
            returnUrl:   successUrl,
            cancelUrl,
        });

        if (!result.success) {
            await prisma.payment.update({
                where: { id: payment.id },
                data:  { status: 'FAILED', errorMessage: result.message },
            });
            return { success: false, error: result.message };
        }

        await prisma.payment.update({
            where: { id: payment.id },
            data:  { providerRef: result.notifToken },
        });

        return {
            success:     true,
            checkoutUrl: result.paymentUrl,
            internalRef: payment.internalRef,
            provider:    'ORANGE_MONEY' as const,
        };

    } catch (error) {
        console.error('[PAYMENT_INIT_ERROR]', error);
        return { success: false, error: "Erreur de communication avec l'opérateur financier." };
    }
}
