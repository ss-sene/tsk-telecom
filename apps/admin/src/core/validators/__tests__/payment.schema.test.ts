import { describe, it, expect } from 'vitest';
import { InitiatePaymentSchema } from '../payment.schema';

const VALID_BASE = {
    firstName: 'Mamadou',
    lastName:  'Diallo',
    phone:     '771234567',
    villageId: 'some-village-uuid',
    amount:    10000,
    provider:  'WAVE' as const,
};

describe('InitiatePaymentSchema', () => {

    describe('valid payloads', () => {
        it('accepts a minimal valid payload', () => {
            const result = InitiatePaymentSchema.safeParse(VALID_BASE);
            expect(result.success).toBe(true);
        });

        it('accepts optional email as empty string', () => {
            const result = InitiatePaymentSchema.safeParse({ ...VALID_BASE, email: '' });
            expect(result.success).toBe(true);
        });

        it('accepts a valid email', () => {
            const result = InitiatePaymentSchema.safeParse({ ...VALID_BASE, email: 'mamadou@example.com' });
            expect(result.success).toBe(true);
        });

        it('accepts ORANGE_MONEY as provider', () => {
            const result = InitiatePaymentSchema.safeParse({ ...VALID_BASE, provider: 'ORANGE_MONEY' });
            expect(result.success).toBe(true);
        });

        it('accepts villageId=OTHER when newVillageName is provided', () => {
            const result = InitiatePaymentSchema.safeParse({
                ...VALID_BASE,
                villageId:      'OTHER',
                newVillageName: 'Touba Sud',
            });
            expect(result.success).toBe(true);
        });

        it('accepts all Senegalese prefixes (77, 78, 76, 75, 70)', () => {
            const prefixes = ['77', '78', '76', '75', '70'];
            for (const p of prefixes) {
                const result = InitiatePaymentSchema.safeParse({ ...VALID_BASE, phone: `${p}1234567` });
                expect(result.success, `prefix ${p}`).toBe(true);
            }
        });
    });

    describe('invalid payloads', () => {
        it('rejects firstName shorter than 2 chars', () => {
            const result = InitiatePaymentSchema.safeParse({ ...VALID_BASE, firstName: 'A' });
            expect(result.success).toBe(false);
        });

        it('rejects lastName shorter than 2 chars', () => {
            const result = InitiatePaymentSchema.safeParse({ ...VALID_BASE, lastName: 'B' });
            expect(result.success).toBe(false);
        });

        it('rejects phone with invalid prefix (ex: 79xxxxxxx)', () => {
            const result = InitiatePaymentSchema.safeParse({ ...VALID_BASE, phone: '791234567' });
            expect(result.success).toBe(false);
        });

        it('rejects phone too short', () => {
            const result = InitiatePaymentSchema.safeParse({ ...VALID_BASE, phone: '7712345' });
            expect(result.success).toBe(false);
        });

        it('rejects phone too long', () => {
            const result = InitiatePaymentSchema.safeParse({ ...VALID_BASE, phone: '77123456789' });
            expect(result.success).toBe(false);
        });

        it('rejects phone with country prefix (221)', () => {
            const result = InitiatePaymentSchema.safeParse({ ...VALID_BASE, phone: '221771234567' });
            expect(result.success).toBe(false);
        });

        it('rejects a malformed email', () => {
            const result = InitiatePaymentSchema.safeParse({ ...VALID_BASE, email: 'not-an-email' });
            expect(result.success).toBe(false);
        });

        it('rejects unknown provider', () => {
            const result = InitiatePaymentSchema.safeParse({ ...VALID_BASE, provider: 'PAYPAL' });
            expect(result.success).toBe(false);
        });

        it('rejects negative amount', () => {
            const result = InitiatePaymentSchema.safeParse({ ...VALID_BASE, amount: -100 });
            expect(result.success).toBe(false);
        });

        it('rejects zero amount', () => {
            const result = InitiatePaymentSchema.safeParse({ ...VALID_BASE, amount: 0 });
            expect(result.success).toBe(false);
        });

        it('rejects villageId=OTHER without newVillageName', () => {
            const result = InitiatePaymentSchema.safeParse({
                ...VALID_BASE,
                villageId: 'OTHER',
            });
            expect(result.success).toBe(false);
        });

        it('rejects villageId=OTHER with blank newVillageName', () => {
            const result = InitiatePaymentSchema.safeParse({
                ...VALID_BASE,
                villageId:      'OTHER',
                newVillageName: ' ',
            });
            expect(result.success).toBe(false);
        });

        it('rejects missing villageId', () => {
            const { villageId: _, ...rest } = VALID_BASE;
            const result = InitiatePaymentSchema.safeParse(rest);
            expect(result.success).toBe(false);
        });
    });
});
