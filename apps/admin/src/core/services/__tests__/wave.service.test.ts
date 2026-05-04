import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createWaveCheckoutSession, verifyWaveWebhookSignature } from '../wave.service';
import { createHmac } from 'crypto';

// ── createWaveCheckoutSession ────────────────────────────────────────────────

describe('createWaveCheckoutSession', () => {
    const API_KEY        = 'test-wave-api-key';
    const SIGNING_SECRET = 'test-wave-signing-secret';
    const PARAMS = {
        amount:      10000,
        internalRef: 'ref-abc',
        successUrl:  'https://tdk.sn/payment/success?ref=ref-abc',
        errorUrl:    'https://tdk.sn/checkout?cancelled=1',
    };

    beforeEach(() => {
        vi.stubEnv('WAVE_API_KEY',        API_KEY);
        vi.stubEnv('WAVE_SIGNING_SECRET', SIGNING_SECRET);
    });

    afterEach(() => {
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
    });

    it('returns waveUrl and sessionId on success', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok:   true,
            json: async () => ({ wave_launch_url: 'https://pay.wave.com/qr/abc', id: 'cos_abc123' }),
        }));

        const result = await createWaveCheckoutSession(PARAMS);

        expect(result.success).toBe(true);
        if (!result.success) return;
        expect(result.waveUrl).toBe('https://pay.wave.com/qr/abc');
        expect(result.sessionId).toBe('cos_abc123');
    });

    it('sends the correct request to the Wave API', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
            ok:   true,
            json: async () => ({ wave_launch_url: 'https://pay.wave.com/qr/x', id: 'cos_xyz' }),
        });
        vi.stubGlobal('fetch', mockFetch);

        await createWaveCheckoutSession(PARAMS);

        const [url, options] = mockFetch.mock.calls[0] as [string, RequestInit & { body: string; headers: Record<string, string> }];
        expect(url).toBe('https://api.wave.com/v1/checkout/sessions');
        expect(options.method).toBe('POST');
        expect(options.headers['Authorization']).toBe(`Bearer ${API_KEY}`);

        // Wave-Signature header must be present and well-formed
        const waveSignatureHeader = options.headers['Wave-Signature'];
        expect(waveSignatureHeader).toMatch(/^t=\d+,v1=[0-9a-f]{64}$/);

        // Verify the signature is computed from the body that was actually sent
        const [tPart, v1Part] = waveSignatureHeader.split(',');
        const timestamp = tPart.slice(2);          // strip "t="
        const signature = v1Part.slice(3);         // strip "v1="
        const expected  = createHmac('sha256', SIGNING_SECRET)
            .update(timestamp + options.body)
            .digest('hex');
        expect(signature).toBe(expected);

        const body = JSON.parse(options.body);
        expect(body.amount).toBe('10000');          // Wave attend une chaîne
        expect(body.currency).toBe('XOF');
        expect(body.client_reference).toBe('ref-abc');
        expect(body.success_url).toBe(PARAMS.successUrl);
        expect(body.error_url).toBe(PARAMS.errorUrl);
    });

    it('returns failure when WAVE_API_KEY is missing', async () => {
        vi.unstubAllEnvs();
        vi.stubEnv('WAVE_SIGNING_SECRET', SIGNING_SECRET);
        const result = await createWaveCheckoutSession(PARAMS);
        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.message).toContain('WAVE_API_KEY');
    });

    it('returns failure when WAVE_SIGNING_SECRET is missing', async () => {
        vi.unstubAllEnvs();
        vi.stubEnv('WAVE_API_KEY', API_KEY);
        const result = await createWaveCheckoutSession(PARAMS);
        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.message).toContain('WAVE_SIGNING_SECRET');
    });

    it('returns failure when Wave API returns a non-ok status', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok:     false,
            status: 401,
            json:   async () => ({ message: 'Unauthorized' }),
        }));

        const result = await createWaveCheckoutSession(PARAMS);
        expect(result.success).toBe(false);
        if (result.success) return;
        expect(result.message).toContain('Unauthorized');
    });

    it('returns failure when response is missing wave_launch_url', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok:   true,
            json: async () => ({ id: 'cos_123' }), // wave_launch_url absent
        }));

        const result = await createWaveCheckoutSession(PARAMS);
        expect(result.success).toBe(false);
    });

    it('returns failure on network error', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
        const result = await createWaveCheckoutSession(PARAMS);
        expect(result.success).toBe(false);
    });
});

// ── verifyWaveWebhookSignature ───────────────────────────────────────────────

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
        const body   = JSON.stringify({ type: 'checkout.session.completed' });
        const ts     = '1700000000';
        const header = buildHeader(ts, body);
        expect(verifyWaveWebhookSignature(header, body)).toBe(true);
    });

    it('rejects a tampered body', () => {
        const body   = JSON.stringify({ type: 'checkout.session.completed' });
        const ts     = '1700000000';
        const header = buildHeader(ts, body);
        expect(verifyWaveWebhookSignature(header, body + ' tampered')).toBe(false);
    });

    it('rejects a tampered signature', () => {
        const body   = JSON.stringify({ type: 'checkout.session.completed' });
        const ts     = '1700000000';
        const header = `Wave ${ts}.${'aa'.repeat(32)}`;
        expect(verifyWaveWebhookSignature(header, body)).toBe(false);
    });

    it('rejects a malformed header (no dot)', () => {
        expect(verifyWaveWebhookSignature('Wave invalidsignature', '{}')).toBe(false);
    });

    it('returns false on any exception (empty secret, etc.)', () => {
        vi.stubEnv('WAVE_WEBHOOK_SECRET', '');
        expect(verifyWaveWebhookSignature('Wave 123.abc', '{}')).toBe(false);
    });
});
