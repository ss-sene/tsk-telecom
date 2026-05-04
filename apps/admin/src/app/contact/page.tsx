import type { Metadata } from 'next';
import Link              from 'next/link';
import { COMPANY }       from '@/lib/company';
import { PublicHeader }  from '@/app/PublicHeader';
import { PublicFooter }  from '@/app/PublicFooter';

export const metadata: Metadata = {
    title:       'Contact — TDK Telecom',
    description: "Contactez TDK Telecom par WhatsApp, téléphone ou email. Souscription en ligne, devis Starlink, assistance technique — notre équipe vous répond sous 24h.",
    alternates:  { canonical: '/contact' },
    openGraph: {
        title:       'Contacter TDK Telecom — Internet au Sénégal',
        description: "Contactez TDK Telecom pour une souscription Internet, un devis Starlink ou toute question. WhatsApp, téléphone ou email.",
        url:         '/contact',
    },
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tdktelecom.sn';

const BREADCRUMB_LD = {
    '@context':        'https://schema.org',
    '@type':           'BreadcrumbList',
    'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': `${APP_URL}/`        },
        { '@type': 'ListItem', 'position': 2, 'name': 'Contact', 'item': `${APP_URL}/contact` },
    ],
};

const CONTACT_PAGE_LD = {
    '@context':    'https://schema.org',
    '@type':       'ContactPage',
    '@id':         `${APP_URL}/contact`,
    'url':         `${APP_URL}/contact`,
    'name':        'Contact TDK Telecom',
    'description': "Contactez TDK Telecom pour souscrire à un forfait Internet, obtenir un devis Starlink ou pour toute assistance.",
    'isPartOf':    { '@id': `${APP_URL}/#website` },
    'about':       { '@id': `${APP_URL}/#organization` },
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-surface-page">
            <PublicHeader />

            <main className="mx-auto max-w-3xl px-5 py-16 sm:py-20">

                <div className="mb-12">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Contact</p>
                    <h1 className="text-3xl font-black tracking-[-0.03em] text-text-base sm:text-4xl mb-4">
                        Parlez-nous
                    </h1>
                    <p className="text-base text-text-muted max-w-[46ch] leading-relaxed">
                        Notre équipe est disponible 7j/7 pour répondre à vos questions sur les abonnements,
                        l&apos;installation ou les équipements.
                    </p>
                </div>

                {/* ── Moyens de contact ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-14">

                    <a
                        href={COMPANY.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col gap-3 rounded-2xl border border-border-default bg-surface-card p-6 hover:border-border-strong hover:shadow-[var(--shadow-card)] transition-all"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-[#25D366]">
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.118 1.527 5.848L.057 23.5l5.797-1.521A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.825 9.825 0 01-5.012-1.37l-.36-.214-3.719.975.993-3.624-.235-.373A9.818 9.818 0 012.182 12C2.182 6.591 6.591 2.182 12 2.182S21.818 6.591 21.818 12 17.409 21.818 12 21.818z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-text-faint mb-1">WhatsApp</p>
                            <p className="text-sm font-semibold text-text-base">{COMPANY.phoneDisplay}</p>
                            <p className="text-xs text-text-muted mt-0.5">Réponse rapide — envoyez un message</p>
                        </div>
                    </a>

                    <a
                        href={`tel:${COMPANY.phone}`}
                        className="flex flex-col gap-3 rounded-2xl border border-border-default bg-surface-card p-6 hover:border-border-strong hover:shadow-[var(--shadow-card)] transition-all"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-text-faint mb-1">Téléphone</p>
                            <p className="text-sm font-semibold text-text-base">{COMPANY.phoneDisplay}</p>
                            <p className="text-xs text-text-muted mt-0.5">Lun–Dim, 8h–20h</p>
                        </div>
                    </a>

                    <a
                        href={`mailto:${COMPANY.email}`}
                        className="flex flex-col gap-3 rounded-2xl border border-border-default bg-surface-card p-6 hover:border-border-strong hover:shadow-[var(--shadow-card)] transition-all"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-light text-brand">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-text-faint mb-1">Email</p>
                            <p className="text-sm font-semibold text-text-base">{COMPANY.email}</p>
                            <p className="text-xs text-text-muted mt-0.5">Réponse sous 24h</p>
                        </div>
                    </a>

                </div>

                {/* ── Adresse ── */}
                <div className="rounded-2xl border border-border-faint bg-surface-section p-6 mb-14">
                    <p className="text-xs font-bold uppercase tracking-wider text-text-faint mb-3">Adresse</p>
                    <div className="flex items-start gap-3">
                        <svg className="h-4 w-4 text-brand mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                            <p className="text-sm font-semibold text-text-base">{COMPANY.name}</p>
                            <p className="text-sm text-text-muted">{COMPANY.address}</p>
                        </div>
                    </div>
                </div>

                {/* ── Accès rapide ── */}
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-text-faint mb-5">Accès rapide</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { href: '/checkout',        label: 'Souscrire à un forfait Internet',    desc: 'Activez votre connexion en ligne en 3 minutes'  },
                            { href: '/starlink',        label: 'Devis Starlink',                     desc: 'Internet satellite partout au Sénégal'          },
                            { href: '/boutique',        label: 'Boutique équipements',               desc: 'Routeurs, kits Starlink et équipements réseau'  },
                            { href: '/zones-couvertes', label: 'Zones couvertes',                    desc: 'Vérifiez la disponibilité dans votre localité'  },
                        ].map(({ href, label, desc }) => (
                            <Link
                                key={href}
                                href={href}
                                className="flex items-start gap-3 rounded-xl border border-border-faint bg-surface-card p-4 hover:border-border-default transition-colors"
                            >
                                <svg className="h-4 w-4 mt-0.5 shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                                <div>
                                    <p className="text-sm font-semibold text-text-base">{label}</p>
                                    <p className="text-xs text-text-muted">{desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="mt-14 pt-8 border-t border-border-faint">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-text-base transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour à l&apos;accueil
                    </Link>
                </div>

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_PAGE_LD) }}
                />
            </main>

            <PublicFooter />
        </div>
    );
}
