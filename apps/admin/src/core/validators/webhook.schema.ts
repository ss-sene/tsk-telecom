
// core/validators/payment.schema.ts
import { z } from 'zod';

// --- SCHÉMA DE VALIDATION (Contrat d'Interface Opérateur) ---
// À adapter selon le format exact envoyé par Wave ou Orange Money
export const WebhookPayloadSchema = z.object({
    internalRef: z.string(), // Notre référence (ex: TDK-XXX)
    providerTransactionId: z.string().optional(), // L'ID chez l'opérateur
    status: z.enum(['SUCCESS', 'FAILED', 'CANCELLED']),
    amount: z.number().positive(),
});
