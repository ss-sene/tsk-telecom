// apps/admin/src/core/actions/payment.action.ts
'use server';

import { prisma } from '@/core/db/prisma';
import { z } from 'zod';
import { InitiatePaymentSchema } from "@/core/validators/payment.schema";
import { SoftPayService, SoftPaySupportedProvider } from '@/core/services/softpay.service';

// --- CATALOGUE (Source de vérité) ---
const PRICING_CATALOG: Record<string, number> = {
    'Pack Standard': 10000,
    'Pack Premium': 12000,
};

export async function initiatePayment(payload: unknown) {
    // 1. Validation Spatio-temporelle O(N) des entrées
    const parsedData = InitiatePaymentSchema.safeParse(payload);

    if (!parsedData.success) {
        console.error("[VALIDATION_ERROR]", parsedData.error.flatten());
        return { success: false, error: "Données invalides. Veuillez vérifier le formulaire." };
    }

    const dto = parsedData.data;
    const internalRef = `TDK-${Date.now()}`.toUpperCase();
    
    // Résolution O(1) du prix réel (Anti-Tampering)
    const actualPrice = PRICING_CATALOG[dto.plan];
    if (!actualPrice) return { success: false, error: "Offre sélectionnée invalide ou expirée." };

    const cleanEmail = dto.email && dto.email.trim() !== '' ? dto.email.trim() : null;

    try {
        // --- 2. RÉSOLUTION DYNAMIQUE DU VILLAGE ---
        let finalVillageId = dto.villageId;

        if (dto.villageId === 'OTHER' && dto.newVillageName) {
            const cleanVillageName = dto.newVillageName.trim().charAt(0).toUpperCase() + dto.newVillageName.trim().slice(1).toLowerCase();
            
            const village = await prisma.village.upsert({
                where: { name: cleanVillageName },
                update: {}, 
                create: { name: cleanVillageName }
            });
            finalVillageId = village.id;
        }

        // --- 3. UPSERT DU CLIENT ---
        const client = await prisma.client.upsert({
            where: { phone: dto.phone },
            update: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                villageId: finalVillageId,
                email: cleanEmail,
            },
            create: {
                phone: dto.phone,
                firstName: dto.firstName,
                lastName: dto.lastName,
                villageId: finalVillageId,
                email: cleanEmail,
            },
        });

        // --- 4. CRÉATION DU PAIEMENT (STATE: PENDING) ---
        const payment = await prisma.payment.create({
            data: {
                amount: actualPrice,
                provider: dto.provider,
                internalRef,
                clientId: client.id,
            },
        });

        // --- 5. EXÉCUTION DU PAIEMENT (STRATEGY PATTERN SOFTPAY) ---
        // Mapping sécurisé du provider sélectionné vers le type strict attendu par le service
        const softPayProvider = dto.provider as SoftPaySupportedProvider;

        const result = await SoftPayService.processPayment(
            softPayProvider,
            payment.internalRef, // On passe l'internalRef au lieu de l'UUID pour matcher avec le Webhook
            actualPrice,
            dto.plan,
            { 
                fullName: `${dto.firstName} ${dto.lastName}`, 
                email: cleanEmail || 'client@tdk-telecom.sn', // SoftPay exige un email valide
                phone: dto.phone,
                password: dto.softpayPassword 
            }
        );

        if (result.success) {
            // Si SoftPay fournit une URL (ex: Wave, QR Code Orange), on redirige le navigateur.
            // Sinon (ex: Push USSD Free Money), on redirige vers notre page de succès locale.
            const targetUrl = result.redirectUrl || `/checkout/success?ref=${internalRef}`;
            return { success: true, redirectUrl: targetUrl };
        } else {
            // Rollback logique immédiat en cas de refus synchrone (ex: solde insuffisant)
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'FAILED', errorMessage: result.message }
            });
            return { success: false, error: result.message };
        }

    } catch (error) {
        // Security by Obscurity : On log l'erreur réelle côté serveur, on renvoie une erreur générique au client.
        console.error("[PAYMENT_INIT_ERROR]", error);
        return { success: false, error: "Erreur de communication avec l'opérateur financier." };
    }
}