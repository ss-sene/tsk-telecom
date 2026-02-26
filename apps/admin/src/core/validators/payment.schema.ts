
// core/validators/payment.schema.ts
import { z } from 'zod';
import { PaymentProvider } from '@/generated/prisma/client';
import { TDK_PLANS_ARRAY, getPriceByPlanName } from '@tdk/config';

// Génère un tableau des montants autorisés : [10000, 12000]
const validPrices = TDK_PLANS_ARRAY.map(p => p.price);

export const InitiatePaymentSchema = z.object({
    firstName: z.string().min(2).max(50).trim(),
    lastName: z.string().min(2).max(50).trim(),
    email: z.email().max(100).optional().or(z.literal('')),
    village: z.string().min(2).max(100).trim(),
    phone: z.string().regex(/^(77|78|76|75|70)\d{7}$/, "Format sénégalais invalide"),
    plan: z.string().max(50),
    provider: z.enum(PaymentProvider),
});