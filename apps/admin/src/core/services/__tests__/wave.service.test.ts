import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createWavePayLink, verifyWaveWebhookSignature } from '../wave.service';
import { createHmac } from 'crypto';

describe('createWavePayLink', () => {
    beforeEach(() => {
        vi.stubEnv('WAVE_MERCHANT_ID', 'tdk-telecom');
    });
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('returns a valid Wave pay URL when WAVE_MERCHANT_ID is set', () => {
        const result = createWavePayLink({ amount: 10000, internalRef: 'ref-abc' });
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.payUrl).toContain('pay.wave.com/m/tdk-telecom');
        expect(result.payUrl).toContain('amount=10000');
    });

    it('sets sessionId to internalRef', () => {
        const result = createWavePayLink({ amount: 5000, internalRef: 'my-ref-123' });
        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.sessionId).toBe('my-ref-123');
    });

    it('returns failure when WAVE_MERCHANT_ID is not set', () => {
        vi.unstubAllEnvs();
        const result = createWavePayLink({ amount: 10000, internalRef: 'ref' });
        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.message).toContain('WAVE_MERCHANT_ID');
    });

    it('encodes the amount correctly in the URL', () => {
        const result = createWavePayLink({ amount: 25000, internalRef: 'r' });
        expect(result.success).toBe(true);
        if (!result.success) return;
        const url = new URL(result.payUrl);
        expect(url.searchParams.get('amount')).toBe('25000');
    });
});

describe('verifyWaveWebhookSignature', () => {
    const SECRET = 'test-webhook-secret';

    function buildHeader(timestamp: string, body: string): string {
        const sig = createHmac('sha256', SECRET)
            .update(`${timestamp}.${body}`)
            .digest('hex');
        return `Wave ${timestamp}.${sig}`;
    }

    beforeEach(() => {
        vi.stubEnv('WAVE_WEBHOOK_SECRET', SECRET);
    });
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('accepts a correctly signed header', () => {
        const body   = JSON.stringify({ type: 'payment.completed' });
        const ts     = '1700000000';
        const header = buildHeader(ts, body);
        expect(verifyWaveWebhookSignature(header, body)).toBe(true);
    });

    it('rejects a tampered body', () => {
        const body   = JSON.stringify({ type: 'payment.completed' });
        const ts     = '1700000000';
        const header = buildHeader(ts, body);
        expect(verifyWaveWebhookSignature(header, body + ' tampered')).toBe(false);
    });

    it('rejects a tampered signature', () => {
        const body   = JSON.stringify({ type: 'payment.completed' });
        const ts     = '1700000000';
        const header = `Wave ${ts}.${'aa'.repeat(32)}`;
        expect(verifyWaveWebhookSignature(header, body)).toBe(false);
    });

    it('rejects a malformed header (no dot)', () => {
        expect(verifyWaveWebhookSignature('Wave invalidsignature', '{}')).toBe(false);
    });

    it('returns false on any exception (wrong secret length etc.)', () => {
        vi.stubEnv('WAVE_WEBHOOK_SECRET', '');
        const result = verifyWaveWebhookSignature('Wave 123.abc', '{}');
        expect(result).toBe(false);
    });
});
