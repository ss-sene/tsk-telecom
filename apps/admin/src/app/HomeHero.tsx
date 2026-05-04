import Link from 'next/link';

// ─── Données statiques du hero ─────────────────────────────────────────────────

const HERO_PLANS = [
    {
        id:       'standard',
        name:     'Pack Standard',
        price:    10_000,
        target:   'Usage quotidien',
        features: [
            "Jusqu'à 15 Mbps",
            'Connexion illimitée 24/7',
            'Activation sous 24 h',
            'Sans engagement',
        ],
        isPopular: false,
    },
    {
        id:       'premium',
        name:     'Pack Premium',
        price:    12_000,
        target:   'Streaming & télétravail',
        features: [
            "Jusqu'à 30 Mbps",
            'Multi-appareils simultanés',
            'Connexion illimitée 24/7',
            'Sans engagement',
        ],
        isPopular: true,
    },
] as const;

const REASSURANCE = [
    {
        path:  'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        label: 'Souscription en 3 minutes',
    },
    {
        path:  'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
        label: 'Wave & Orange Money',
    },
    {
        path:  'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        label: 'Activation sous 24 h',
    },
    {
        path:  'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
        label: 'Techniciens locaux',
    },
] as const;

// ─── Composant ─────────────────────────────────────────────────────────────────

export function HomeHero() {
    return (
        <section className="relative overflow-hidden border-b border-white/5 bg-surface-section px-5 py-20 sm:py-28 lg:py-36">

            {/* ── Décor atmosphérique — halo radial doux centré en haut ── */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-5%,rgba(111,163,200,0.08),transparent)]" />
                <div className="absolute top-0 left-1/2 h-px w-3/4 max-w-2xl -translate-x-1/2 bg-gradient-to-r from-transparent via-[#6FA3C8]/25 to-transparent" />
            </div>

            <div className="relative mx-auto max-w-4xl text-center">

                {/* ── Badge contextuel ── */}
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#6FA3C8]/30 bg-[#6FA3C8]/10 px-4 py-1.5 text-xs font-medium text-brand">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success animate-pulse" aria-hidden="true" />
                    Internet haut débit &bull; Disponible au Sénégal &bull; Paiement mobile
                </div>

                {/* ── Titre H1 ── */}
                <h1 className="mb-5 text-[clamp(34px,5.5vw,56px)] font-semibold leading-[1.07] tracking-tight text-text-base">
                    Un internet fiable.<br />
                    Deux offres claires.{' '}
                    <span className="bg-gradient-to-r from-blue-200 to-indigo-300 bg-clip-text text-transparent">
                        Payez depuis votre téléphone.
                    </span>
                </h1>

                {/* ── Sous-titre ── */}
                <p className="mx-auto mb-11 max-w-[52ch] text-base text-text-secondary leading-relaxed sm:text-lg">
                    Souscrivez en ligne, choisissez Standard ou Premium, et payez directement
                    via Wave ou Orange Money. Activation sous 24&nbsp;h par nos techniciens au Sénégal.
                </p>

                {/* ── Cartes forfaits — Niveau 2 ── */}
                <div className="mx-auto mb-10 grid max-w-2xl grid-cols-1 gap-4 text-left sm:grid-cols-2">
                    {HERO_PLANS.map(plan => (
                        <article
                            key={plan.id}
                            className={`relative flex flex-col rounded-2xl p-6 ${
                                plan.isPopular
                                    ? 'border-2 border-brand/50 bg-surface-card shadow-[0_4px_28px_rgba(111,163,200,0.11)]'
                                    : 'border border-border-subtle bg-surface-card'
                            }`}
                        >
                            {plan.isPopular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-3.5 py-0.5 text-[11px] font-semibold text-[#121A26]">
                                    Le plus choisi
                                </div>
                            )}

                            <p className="mb-1 text-[10px] font-bold uppercase tracking-[.12em] text-text-faint">
                                {plan.target}
                            </p>
                            <p className={`mb-1 text-sm font-semibold ${plan.isPopular ? 'text-brand' : 'text-text-base'}`}>
                                {plan.name}
                            </p>

                            <div className="mb-5 flex items-baseline gap-1.5">
                                <span className="text-3xl font-bold tracking-tight text-text-base">
                                    {plan.price.toLocaleString('fr-FR')}
                                </span>
                                <span className="text-sm text-text-muted">FCFA&nbsp;/&nbsp;mois</span>
                            </div>

                            <ul className="mb-6 flex-1 space-y-2">
                                {plan.features.map(f => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                                        <svg className="h-3.5 w-3.5 shrink-0 text-success" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={`/checkout?plan=${encodeURIComponent(plan.name)}`}
                                className={`flex h-10 items-center justify-center rounded-xl text-sm font-semibold transition-colors ${
                                    plan.isPopular
                                        ? 'bg-brand text-[#121A26] hover:brightness-110'
                                        : 'border border-[#6FA3C8]/40 text-brand hover:bg-[#6FA3C8]/10'
                                }`}
                            >
                                Souscrire à cette offre
                            </Link>
                        </article>
                    ))}
                </div>

                {/* ── CTA principale + secondaire ── */}
                <div className="mb-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        href="/checkout"
                        className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand px-7 text-sm font-semibold text-[#121A26] transition-all hover:brightness-110"
                    >
                        Souscrire maintenant
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                    <Link
                        href="#offres"
                        className="inline-flex h-12 items-center rounded-xl border border-[#6FA3C8]/50 bg-[#6FA3C8]/5 px-7 text-sm font-semibold text-brand transition-colors hover:bg-[#6FA3C8]/12"
                    >
                        Voir tous les forfaits
                    </Link>
                </div>

                {/* ── Barre de réassurance ── */}
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-text-muted">
                    {REASSURANCE.map(({ path, label }) => (
                        <span key={label} className="flex items-center gap-1.5">
                            <svg className="h-3.5 w-3.5 shrink-0 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
                            </svg>
                            {label}
                        </span>
                    ))}
                </div>

            </div>
        </section>
    );
}
