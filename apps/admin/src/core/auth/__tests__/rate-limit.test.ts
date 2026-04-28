import { describe, it, expect, beforeEach, vi } from 'vitest';

// Rate-limit uses module-level state — reload the module between test suites
// so the in-memory store is always fresh.

describe('checkLoginRate', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(0);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.resetModules();
    });

    it('allows the first request', async () => {
        const { checkLoginRate } = await import('../rate-limit');
        const result = checkLoginRate('1.2.3.4');
        expect(result.allowed).toBe(true);
    });

    it('allows up to MAX_LOGIN (5) requests within the window', async () => {
        const { checkLoginRate } = await import('../rate-limit');
        for (let i = 0; i < 5; i++) {
            expect(checkLoginRate('10.0.0.1').allowed, `attempt ${i + 1}`).toBe(true);
        }
    });

    it('blocks the 6th request within the window', async () => {
        const { checkLoginRate } = await import('../rate-limit');
        for (let i = 0; i < 5; i++) checkLoginRate('10.0.0.2');
        const result = checkLoginRate('10.0.0.2');
        expect(result.allowed).toBe(false);
        expect(result.retryAfterMs).toBeGreaterThan(0);
    });

    it('allows requests again after the 60s window resets', async () => {
        const { checkLoginRate } = await import('../rate-limit');
        for (let i = 0; i < 5; i++) checkLoginRate('10.0.0.3');
        expect(checkLoginRate('10.0.0.3').allowed).toBe(false);

        // Advance time past the 60-second window
        vi.advanceTimersByTime(61_000);

        expect(checkLoginRate('10.0.0.3').allowed).toBe(true);
    });

    it('tracks different IPs independently', async () => {
        const { checkLoginRate } = await import('../rate-limit');
        for (let i = 0; i < 5; i++) checkLoginRate('192.168.1.1');
        expect(checkLoginRate('192.168.1.1').allowed).toBe(false);

        // A different IP is not affected
        expect(checkLoginRate('192.168.1.2').allowed).toBe(true);
    });
});

describe('checkWebhookRate', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(0);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.resetModules();
    });

    it('allows up to 120 webhook requests per minute', async () => {
        const { checkWebhookRate } = await import('../rate-limit');
        for (let i = 0; i < 120; i++) {
            expect(checkWebhookRate('1.1.1.1').allowed, `attempt ${i + 1}`).toBe(true);
        }
        expect(checkWebhookRate('1.1.1.1').allowed).toBe(false);
    });

    it('does not share state with login rate limiter', async () => {
        const { checkLoginRate, checkWebhookRate } = await import('../rate-limit');
        for (let i = 0; i < 5; i++) checkLoginRate('5.5.5.5');
        expect(checkLoginRate('5.5.5.5').allowed).toBe(false);
        // Same IP on webhook bucket is still allowed
        expect(checkWebhookRate('5.5.5.5').allowed).toBe(true);
    });
});
