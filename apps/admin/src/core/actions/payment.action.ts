'use server';

import { prisma } from '@/core/db/prisma';
import { PaymentProvider } from '@prisma/client';
import { z } from 'zod';
import { InitiatePaymentSchema } from "@/core/validators/payment.schema";

const PRICING_CATALOG: Record<string, number> = {
    'Pack Standard': 10000,
    'Pack Premium': 12000,
};

export async function initiatePayment(payload: unknown) {
    // 1. Validation Spatio-temporelle O(N) des entrées (Zod Parse)
    const parsedData = InitiatePaymentSchema.safeParse(payload);

    if (!parsedData.success) {
        // Fail-fast : Retourne les erreurs de formatage sans toucher la DB
        console.error("Validation Error:", z.treeifyError(parsedData.error));
        return { success: false, error: "Données invalides ou corrompues." };
    }

    const dto = parsedData.data;
    const internalRef = `TDK-${Date.now()}`.toUpperCase();
    const planEncoded = encodeURIComponent(dto.plan);

    const actualPrice = PRICING_CATALOG[dto.plan];
    if (!actualPrice) {
        return { success: false, error: "Offre sélectionnée invalide ou expirée." };
    }

    try {
        // 2. Exécution Prisma avec données purifiées
        await prisma.payment.create({
            data: {
                amount: actualPrice,
                provider: dto.provider,
                internalRef,
                client: {
                    connectOrCreate: {
                        where: { phone: dto.phone },
                        create: {
                            phone: dto.phone,
                            firstName: dto.firstName,
                            lastName: dto.lastName,
                            village: dto.village,
                            email: dto.email,
                        },
                    },
                },
            },
        });

        return {
            success: true,
            redirectUrl: `/checkout/success?ref=${internalRef}&plan=${planEncoded}`
        };

    } catch (error) {
        // Log exhaustif côté serveur, message générique côté client (Security by Obscurity)
        console.error("[PAYMENT_INIT_ERROR]", error);
        return { success: false, error: "Erreur interne lors de l'initialisation." };
    }
}