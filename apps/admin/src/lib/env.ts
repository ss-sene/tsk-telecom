import { z } from 'zod';

const schema = z.object({
    // DB
    DATABASE_URL:       z.string().min(1, 'DATABASE_URL is required'),
    // Admin auth
    ADMIN_SECRET_TOKEN: z.string().min(32, 'ADMIN_SECRET_TOKEN must be at least 32 chars'),
    // App
    NEXT_PUBLIC_APP_URL: z.string().url({ message: 'NEXT_PUBLIC_APP_URL must be a valid URL' }),
    // Wave Checkout API
    WAVE_API_KEY:        z.string().min(1, 'WAVE_API_KEY is required'),
    WAVE_WEBHOOK_SECRET: z.string().min(1, 'WAVE_WEBHOOK_SECRET is required'),
    // Orange Money API
    OM_CLIENT_ID:     z.string().min(1, 'OM_CLIENT_ID is required'),
    OM_CLIENT_SECRET: z.string().min(1, 'OM_CLIENT_SECRET is required'),
    OM_BASE_URL:      z.string().url({ message: 'OM_BASE_URL must be a valid URL' }),
    OM_MERCHANT_KEY:  z.string().min(1, 'OM_MERCHANT_KEY is required'),
});

function validateEnv() {
    const parsed = schema.safeParse(process.env);
    if (!parsed.success) {
        const missing = parsed.error.issues
            .map((i) => `  • ${i.path.join('.')}: ${i.message}`)
            .join('\n');
        throw new Error(`\n[env] Missing or invalid environment variables:\n${missing}\n`);
    }
    return parsed.data;
}

export const env = validateEnv();
