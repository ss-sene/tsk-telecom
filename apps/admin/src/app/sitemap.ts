import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tdktelecom.sn';
    const now  = new Date();

    return [
        {
            url:             `${base}/`,
            lastModified:    now,
            changeFrequency: 'weekly',
            priority:        1.0,
        },
        {
            url:             `${base}/starlink`,
            lastModified:    now,
            changeFrequency: 'monthly',
            priority:        0.9,
        },
        {
            url:             `${base}/boutique`,
            lastModified:    now,
            changeFrequency: 'weekly',
            priority:        0.8,
        },
        {
            url:             `${base}/zones-couvertes`,
            lastModified:    now,
            changeFrequency: 'weekly',
            priority:        0.7,
        },
        {
            url:             `${base}/contact`,
            lastModified:    now,
            changeFrequency: 'monthly',
            priority:        0.5,
        },
        {
            url:             `${base}/mentions-legales`,
            lastModified:    new Date('2026-04-01'),
            changeFrequency: 'yearly',
            priority:        0.2,
        },
        {
            url:             `${base}/politique-de-confidentialite`,
            lastModified:    new Date('2026-04-01'),
            changeFrequency: 'yearly',
            priority:        0.2,
        },
        {
            url:             `${base}/cgu`,
            lastModified:    new Date('2026-04-01'),
            changeFrequency: 'yearly',
            priority:        0.2,
        },
        // Exclusions intentionnelles (robots.ts les bloque aussi) :
        // /checkout   — tunnel de conversion, non indexable
        // /payment/   — confirmation paiement, non indexable
        // /admin/     — backoffice, non indexable
        // /login      — authentification, non indexable
    ];
}
