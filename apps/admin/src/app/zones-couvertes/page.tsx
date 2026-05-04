export const revalidate = 3600;

import type { Metadata } from 'next';
import Link              from 'next/link';
import { prisma }        from '@/core/db/prisma';
import { COMPANY }       from '@/lib/company';
import { PublicHeader }  from '@/app/PublicHeader';
import { PublicFooter }  from '@/app/PublicFooter';

export const metadata: Metadata = {
    title:       'Zones Couvertes — Internet Haut Débit au Sénégal',
    description: "TDK Telecom couvre des villages et localités au Sénégal. Vérifiez si votre zone est desservie et souscrivez à un forfait Internet dès 10 000 FCFA/mois, activation sous 24h.",
    alternates:  { canonical: '/zones-couvertes' },
    openGraph: {
        title:       'Zones Couvertes par TDK Telecom — Internet au Sénégal',
        description: "Consultez la liste des localités desservies par TDK Telecom. Si votre village n'y figure pas, contactez-nous — notre réseau s'étend régulièrement.",
        url:         '/zones-couvertes',
    },
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tdktelecom.sn';

export default async function ZonesCouvertesPage() {
    const villages = await prisma.village.findMany({
        orderBy: { titre: 'asc' },
        select:  { id: true, titre: true },
    });

    const BREADCRUMB_LD = {
        '@context':        'https://schema.org',
        '@type':           'BreadcrumbList',
        'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Accueil',         'item': `${APP_URL}/`                },
            { '@type': 'ListItem', 'position': 2, 'name': 'Zones couvertes', 'item': `${APP_URL}/zones-couvertes` },
        ],
    };

    const ZONES_LD = villages.length > 0 ? {
        '@context':        'https://schema.org',
        '@type':           'ItemList',
        'name':            'Zones couvertes par TDK Telecom au Sénégal',
        'description':     'Liste des villages et localités desservis par TDK Telecom au Sénégal.',
        'numberOfItems':   villages.length,
        'itemListElement': villages.map((v, i) => ({
            '@type':    'ListItem',
            'position': i + 1,
            'name':     v.titre ?? 'Village',
            'item': {
                '@type': 'City',
                'name':  v.titre ?? 'Village',
                'containedInPlace': { '@type': 'Country', 'name': 'Sénégal' },
            },
        })),
    } : null;

    return (
        <div className="min-h-screen bg-surface-page">
            <PublicHeader />

            <main>

                {/* ── Hero ── */}
                <section className="bg-surface-page px-5 pt-16 pb-12 sm:pt-20 sm:pb-16">
                    <div className="mx-auto max-w-4xl">
                        <div className="mb-3">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-muted hover:text-text-base transition-colors"
                            >
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Accueil
                            </Link>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Couverture</p>
                        <h1 className="text-3xl font-black tracking-[-0.03em] text-text-base sm:text-4xl mb-4">
                            Zones couvertes
                        </h1>
                        <p className="text-base text-text-muted max-w-[52ch] leading-relaxed">
                            TDK Telecom déploie l&apos;Internet haut débit dans{' '}
                            <strong className="text-text-secondary">{villages.length} localité{villages.length > 1 ? 's' : ''}</strong>{' '}
                            au Sénégal. Vérifiez si votre zone est desservie et souscrivez directement en ligne.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                href="/checkout"
                                className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-6 text-sm font-bold text-[#121A26] hover:bg-brand-hover transition-colors"
                            >
                                Souscrire maintenant
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <a
                                href={COMPANY.whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex h-11 items-center gap-2 rounded-xl border border-border-default bg-transparent px-6 text-sm font-semibold text-text-secondary hover:bg-surface-card transition-colors"
                            >
                                Ma zone n&apos;est pas listée
                            </a>
                        </div>
                    </div>
                </section>

                {/* ── Grille des zones ── */}
                <section className="bg-surface-section px-5 py-12 sm:py-16">
                    <div className="mx-auto max-w-4xl">
                        {villages.length === 0 ? (
                            <div className="rounded-2xl border border-border-default bg-surface-card py-20 text-center">
                                <p className="text-text-muted mb-4 text-sm">La liste des zones est en cours de mise à jour.</p>
                                <a
                                    href={COMPANY.whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-[#121A26] hover:bg-brand-hover transition-colors"
                                >
                                    Contactez-nous sur WhatsApp
                                </a>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between gap-4 mb-6">
                                    <h2 className="text-lg font-extrabold text-text-base">
                                        Localités desservies
                                    </h2>
                                    <span className="text-sm text-text-faint">
                                        {villages.length} zone{villages.length > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {villages.map(v => (
                                        <li
                                            key={v.id}
                                            className="flex items-center gap-2.5 rounded-xl border border-border-faint bg-surface-card px-4 py-3 text-sm font-medium text-text-secondary"
                                        >
                                            <span className="h-2 w-2 rounded-full bg-success shrink-0" aria-hidden="true" />
                                            {v.titre ?? 'Village'}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </section>

                {/* ── Votre zone n'y est pas ? ── */}
                <section className="bg-surface-page px-5 py-12 sm:py-16">
                    <div className="mx-auto max-w-3xl text-center">
                        <h2 className="text-2xl font-black tracking-[-0.03em] text-text-base mb-3">
                            Votre localité n&apos;est pas dans la liste ?
                        </h2>
                        <p className="text-sm text-text-muted max-w-[46ch] mx-auto mb-6 leading-relaxed">
                            Notre réseau s&apos;étend régulièrement. Contactez-nous via WhatsApp ou par téléphone —
                            nous évaluons la faisabilité de votre zone sous 24 heures.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <a
                                href={COMPANY.whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-[#121A26] hover:bg-brand-hover transition-colors shadow-sm"
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.118 1.527 5.848L.057 23.5l5.797-1.521A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.825 9.825 0 01-5.012-1.37l-.36-.214-3.719.975.993-3.624-.235-.373A9.818 9.818 0 012.182 12C2.182 6.591 6.591 2.182 12 2.182S21.818 6.591 21.818 12 17.409 21.818 12 21.818z" />
                                </svg>
                                Contactez-nous sur WhatsApp
                            </a>
                            <a
                                href={`tel:${COMPANY.phone}`}
                                className="inline-flex items-center gap-2 rounded-xl border border-border-default bg-transparent px-6 py-3 text-sm font-semibold text-text-secondary hover:bg-surface-card transition-colors"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {COMPANY.phoneDisplay}
                            </a>
                        </div>
                    </div>
                </section>

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }}
                />
                {ZONES_LD && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(ZONES_LD) }}
                    />
                )}
            </main>

            <PublicFooter />
        </div>
    );
}
