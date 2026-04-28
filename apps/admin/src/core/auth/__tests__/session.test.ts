import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createSessionToken, verifySessionToken } from '../session';

const SECRET = 'test-admin-secret-long-enough-for-hmac';

describe('createSessionToken / verifySessionToken', () => {
    beforeEach(() => {
        vi.stubEnv('ADMIN_SECRET_TOKEN', SECRET);
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it('generates a token that verifies successfully', async () => {
        const token = await createSessionToken();
        expect(typeof token).toBe('string');
        expect(token.length).toBeGreaterThan(10);
        await expect(verifySessionToken(token)).resolves.toBe(true);
    });

    it('generates a token containing a dot separator', async () => {
        const token = await createSessionToken();
        expect(token).toContain('.');
    });

    it('generates unique tokens on each call', async () => {
        const t1 = await createSessionToken();
        const t2 = await createSessionToken();
        expect(t1).not.toBe(t2);
    });

    it('rejects a token with a tampered id part', async () => {
        const token  = await createSessionToken();
        const parts  = token.split('.');
        const tampered = `aaaa${parts[0].slice(4)}.${parts[1]}`;
        await expect(verifySessionToken(tampered)).resolves.toBe(false);
    });

    it('rejects a token with a tampered signature part', async () => {
        const token = await createSessionToken();
        const parts = token.split('.');
        const tampered = `${parts[0]}.${'bb'.repeat(32)}`;
        await expect(verifySessionToken(tampered)).resolves.toBe(false);
    });

    it('rejects a token with no dot separator', async () => {
        await expect(verifySessionToken('nodottoken')).resolves.toBe(false);
    });

    it('rejects an empty string', async () => {
        await expect(verifySessionToken('')).resolves.toBe(false);
    });

    it('rejects a token signed with a different secret', async () => {
        // Sign with original secret
        const token = await createSessionToken();

        // Verify with different secret
        vi.stubEnv('ADMIN_SECRET_TOKEN', 'completely-different-secret-key');
        await expect(verifySessionToken(token)).resolves.toBe(false);
    });

    it('throws when ADMIN_SECRET_TOKEN is missing during creation', async () => {
        vi.unstubAllEnvs();
        await expect(createSessionToken()).rejects.toThrow('ADMIN_SECRET_TOKEN');
    });
});
