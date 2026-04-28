import { describe, it, expect, beforeEach, vi } from 'vitest';

// vi.hoisted ensures these references are initialised before vi.mock() factories run
const {
    mockVillageUpsert,
    mockClientUpsert,
    mockPaymentCreate,
    mockPaymentUpdate,
    mockTransaction,
    mockCreateWavePayLink,
    mockCreateOrangeMoneyPayment,
} = vi.hoisted(() => ({
    mockVillageUpsert:            vi.fn(),
    mockClientUpsert:             vi.fn(),
    mockPaymentCreate:            vi.fn(),
    mockPaymentUpdate:            vi.fn(),
    mockTransaction:              vi.fn(),
    mockCreateWavePayLink:        vi.fn(),
    mockCreateOrangeMoneyPayment: vi.fn(),
}));

vi.mock('@/lib/env', () => ({}));

vi.mock('@/core/db/prisma', () => ({
    prisma: {
        village:      { upsert: mockVillageUpsert },
        payment:      { update: mockPaymentUpdate },
        $transaction: mockTransaction,
    },
}));

vi.mock('@/core/services/wave.service', () => ({
    createWavePayLink: mockCreateWavePayLink,
}));

vi.mock('@/core/services/orange-money.service', () => ({
    createOrangeMoneyPayment: mockCreateOrangeMoneyPayment,
}));

import { initiatePayment } from '../payment.action';

const VALID_WAVE_PAYLOAD = {
    firstName: 'Mamadou',
    lastName:  'Diallo',
    phone:     '771234567',
    villageId: 'village-uuid-001',
    amount:    10000,
    provider:  'WAVE' as const,
};

const VALID_OM_PAYLOAD = {
    ...VALID_WAVE_PAYLOAD,
    provider: 'ORANGE_MONEY' as const,
};

function setupTransaction(clientId = 'client-uuid', paymentId = 'payment-uuid', internalRef = 'cuid-abc') {
    mockTransaction.mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) =>
        fn({
            client:  { upsert: mockClientUpsert.mockResolvedValue({ id: clientId }) },
            payment: { create: mockPaymentCreate.mockResolvedValue({ id: paymentId, internalRef }) },
        })
    );
}

describe('initiatePayment', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ── Validation ──────────────────────────────────────────────────────────

    it('returns failure for an invalid payload (missing phone)', async () => {
        const { phone: _, ...bad } = VALID_WAVE_PAYLOAD;
        const result = await initiatePayment(bad);
        expect(result.success).toBe(false);
        expect((result as { error: string }).error).toMatch(/invalides/i);
        expect(mockTransaction).not.toHaveBeenCalled();
    });

    it('returns failure when amount is not in TDK_PLANS_ARRAY', async () => {
        const result = await initiatePayment({ ...VALID_WAVE_PAYLOAD, amount: 99999 });
        expect(result.success).toBe(false);
        expect((result as { error: string }).error).toMatch(/invalide/i);
        expect(mockTransaction).not.toHaveBeenCalled();
    });

    // ── WAVE happy path ──────────────────────────────────────────────────────

    it('returns checkoutUrl for a valid WAVE payment', async () => {
        setupTransaction();
        mockCreateWavePayLink.mockReturnValue({
            success:   true,
            payUrl:    'https://pay.wave.com/m/tdk-telecom?amount=10000&session_id=cuid-abc',
            sessionId: 'cuid-abc',
        });

        const result = await initiatePayment(VALID_WAVE_PAYLOAD);

        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.checkoutUrl).toContain('wave.com');
        expect(result.internalRef).toBe('cuid-abc');
        expect(result.provider).toBe('WAVE');
        expect(mockPaymentUpdate).not.toHaveBeenCalled();
    });

    it('uses amount 12000 (premium plan) for WAVE', async () => {
        setupTransaction('c2', 'p2', 'ref-premium');
        mockCreateWavePayLink.mockReturnValue({
            success: true,
            payUrl:  'https://pay.wave.com/m/tdk-telecom?amount=12000&session_id=ref-premium',
            sessionId: 'ref-premium',
        });

        const result = await initiatePayment({ ...VALID_WAVE_PAYLOAD, amount: 12000 });
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.provider).toBe('WAVE');
    });

    // ── villageId = 'OTHER' ──────────────────────────────────────────────────

    it('upserts a new village when villageId is OTHER', async () => {
        mockVillageUpsert.mockResolvedValue({ id: 'new-village-id' });
        setupTransaction();
        mockCreateWavePayLink.mockReturnValue({ success: true, payUrl: 'https://pay.wave.com/m/x', sessionId: 'ref' });

        await initiatePayment({
            ...VALID_WAVE_PAYLOAD,
            villageId:      'OTHER',
            newVillageName: 'touba sud',
        });

        expect(mockVillageUpsert).toHaveBeenCalledWith(
            expect.objectContaining({
                where:  { titre: 'Touba sud' },
                create: { titre: 'Touba sud' },
            })
        );

        // The tx.client.upsert should receive the resolved village id
        expect(mockClientUpsert).toHaveBeenCalledWith(
            expect.objectContaining({
                where:  { phone: '771234567' },
                create: expect.objectContaining({ villageId: 'new-village-id' }),
            })
        );
    });

    // ── WAVE failure ─────────────────────────────────────────────────────────

    it('marks payment FAILED and returns failure when Wave service errors', async () => {
        setupTransaction('c3', 'p3', 'ref-fail');
        mockCreateWavePayLink.mockReturnValue({ success: false, message: 'WAVE_MERCHANT_ID manquant' });

        const result = await initiatePayment(VALID_WAVE_PAYLOAD);

        expect(result.success).toBe(false);
        expect(mockPaymentUpdate).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 'p3' },
                data:  expect.objectContaining({ status: 'FAILED' }),
            })
        );
    });

    // ── Orange Money happy path ───────────────────────────────────────────────

    it('returns checkoutUrl for a valid ORANGE_MONEY payment', async () => {
        setupTransaction('c4', 'p4', 'ref-om');
        mockCreateOrangeMoneyPayment.mockResolvedValue({
            success:      true,
            paymentUrl:   'https://api.orange.com/pay/...',
            notifToken:   'notif-token-xyz',
        });

        const result = await initiatePayment(VALID_OM_PAYLOAD);

        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.checkoutUrl).toContain('orange.com');
        expect(result.provider).toBe('ORANGE_MONEY');
        expect(result.internalRef).toBe('ref-om');
        // providerRef should be stored
        expect(mockPaymentUpdate).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 'p4' },
                data:  expect.objectContaining({ providerRef: 'notif-token-xyz' }),
            })
        );
    });

    // ── Orange Money failure ──────────────────────────────────────────────────

    it('marks payment FAILED and returns failure when Orange Money service errors', async () => {
        setupTransaction('c5', 'p5', 'ref-om-fail');
        mockCreateOrangeMoneyPayment.mockResolvedValue({ success: false, message: 'Token OAuth expiré' });

        const result = await initiatePayment(VALID_OM_PAYLOAD);

        expect(result.success).toBe(false);
        expect(mockPaymentUpdate).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: 'p5' },
                data:  expect.objectContaining({ status: 'FAILED' }),
            })
        );
    });

    // ── DB transaction throws ─────────────────────────────────────────────────

    it('returns generic failure when the DB transaction throws', async () => {
        mockTransaction.mockRejectedValue(new Error('Connection timeout'));

        const result = await initiatePayment(VALID_WAVE_PAYLOAD);

        expect(result.success).toBe(false);
        expect((result as { error: string }).error).toMatch(/opérateur financier/i);
    });
});
