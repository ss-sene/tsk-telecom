import type { NextConfig } from "next";

const CSP = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    // Neon serverless uses WebSocket; allow Wave + Orange Money API calls from server actions
    "connect-src 'self' https://api.wave.com https://api.orange-sonatel.com wss://*.neon.tech https://www.google-analytics.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
].join('; ');

const SECURITY_HEADERS = [
    { key: 'X-DNS-Prefetch-Control',    value: 'on' },
    { key: 'X-Frame-Options',           value: 'DENY' },
    { key: 'X-Content-Type-Options',    value: 'nosniff' },
    { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
    { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(), payment=(self)' },
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
    { key: 'Content-Security-Policy',   value: CSP },
];

const nextConfig: NextConfig = {
    reactCompiler: true,
    output: 'standalone',
    transpilePackages: ['@tdk/config'],
    async headers() {
        return [{ source: '/(.*)', headers: SECURITY_HEADERS }];
    },
};

export default nextConfig;
