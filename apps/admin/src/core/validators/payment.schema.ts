import { z } from 'zod';
 
// ✅ Enum Zod natif — pas d'import Prisma
export const PaymentProviderEnum = z.enum(['WAVE', 'ORANGE_MONEY']);
export type PaymentProviderType = z.infer<typeof PaymentProviderEnum>;
 
export const InitiatePaymentSchema = z.object({
    firstName:      z.string().min(2, 'Prénom requis (2 caractères minimum)'),
    lastName:       z.string().min(2, 'Nom requis (2 caractères minimum)'),
    email:          z.email('Email invalide').optional().or(z.literal('')),
    phone:          z.string().regex(/^(77|78|76|75|70)\d{7}$/, 'Numéro invalide (9 chiffres sans indicatif)'),
    villageId:      z.string().min(1, 'Zone de couverture requise'),
    newVillageName: z.string().optional(),
    amount:         z.number().int().positive('Montant invalide'),
    provider:       PaymentProviderEnum,
}).refine(data => {
    if (data.villageId === 'OTHER') {
        return !!data.newVillageName && data.newVillageName.trim().length > 1;
    }
    return true;
}, {
    message: 'Veuillez préciser le nom de votre zone de couverture',
    path: ['newVillageName'],
});
 
export type InitiatePaymentDto = z.infer<typeof InitiatePaymentSchema>;