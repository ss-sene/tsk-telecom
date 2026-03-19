'use server';

import { prisma } from '@/core/db/prisma';
import { PaymentStatus } from '@/generated/prisma/client';
import { revalidatePath } from 'next/cache';

/**
 * Met à jour manuellement le statut d'une transaction depuis le Dashboard.
 */
export async function updatePaymentStatus(paymentId: string, newStatus: PaymentStatus) {
    try {
        await prisma.payment.update({
            where: { id: paymentId },
            data: { status: newStatus }
        });

        // Purge le cache Next.js de la route /admin
        // Cela force le recalcul immédiat des KPIs (Revenus, Taux de conversion) en haut de page
        revalidatePath('/admin');
        
        return { success: true };
    } catch (error) {
        console.error('[UPDATE_PAYMENT_STATUS_ERROR]', error);
        return { success: false, error: 'Échec de la mise à jour en base de données.' };
    }
}