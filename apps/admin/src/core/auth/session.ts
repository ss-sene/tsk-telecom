// Web Crypto API — compatible Edge Runtime (middleware/proxy) ET Node.js
// N'importe jamais 'crypto' de Node.js

const SESSION_SEPARATOR = '.';

function bufToHex(buf: ArrayBuffer): string {
    return Array.from(new Uint8Array(buf), b => b.toString(16).padStart(2, '0')).join('');
}

function hexToBuf(hex: string): Uint8Array<ArrayBuffer> {
    const out = new Uint8Array(hex.length / 2) as Uint8Array<ArrayBuffer>;
    for (let i = 0; i < hex.length; i += 2) out[i >> 1] = parseInt(hex.slice(i, i + 2), 16);
    return out;
}

async function getHmacKey(): Promise<CryptoKey> {
    const secret = process.env.ADMIN_SECRET_TOKEN;
    if (!secret) throw new Error('ADMIN_SECRET_TOKEN is not set');
    return crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify'],
    );
}

/** Generate an opaque session token: `<randomId>.<HMAC-SHA256(randomId, secret)>` */
export async function createSessionToken(): Promise<string> {
    const id  = bufToHex(crypto.getRandomValues(new Uint8Array(32)).buffer as ArrayBuffer);
    const key = await getHmacKey();
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(id));
    return `${id}${SESSION_SEPARATOR}${bufToHex(sig)}`;
}

/** Constant-time HMAC verification — returns true only when both checks pass. */
export async function verifySessionToken(token: string): Promise<boolean> {
    try {
        const idx = token.indexOf(SESSION_SEPARATOR);
        if (idx === -1) return false;
        const id  = token.slice(0, idx);
        const sig = hexToBuf(token.slice(idx + 1));
        const key = await getHmacKey();
        return await crypto.subtle.verify('HMAC', key, sig, new TextEncoder().encode(id));
    } catch {
        return false;
    }
}
