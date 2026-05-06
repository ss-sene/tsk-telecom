import { ScrollLink } from '@/components/ui/ScrollLink';

const REASSURANCE = [
    {
        path:  'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
        label: 'Paiement en 3 minutes',
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

export function HomeHero() {
    return (
        <section className="relative overflow-hidden border-b border-white/5 bg-surface-section px-5 py-24 sm:py-32 lg:py-40">

            {/* Décor atmosphérique */}
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-5%,rgba(111,163,200,0.08),transparent)]" />
                <div className="absolute top-0 left-1/2 h-px w-3/4 max-w-2xl -translate-x-1/2 bg-gradient-to-r from-transparent via-[#6FA3C8]/25 to-transparent" />
            </div>

            <div className="relative mx-auto max-w-3xl text-center">

                {/* Badge */}
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#6FA3C8]/30 bg-[#6FA3C8]/10 px-4 py-1.5 text-xs font-medium text-brand">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success animate-pulse" aria-hidden="true" />
                    Internet haut débit &bull; Disponible au Sénégal &bull; Paiement mobile
                </div>

                {/* H1 */}
                <h1 className="mb-5 text-[clamp(34px,5.5vw,56px)] font-semibold leading-[1.07] tracking-tight text-text-base">
                    Un internet fiable.<br />
                    Deux offres claires.{' '}
                    <span className="bg-gradient-to-r from-blue-200 to-indigo-300 bg-clip-text text-transparent">
                        Payez depuis votre téléphone.
                    </span>
                </h1>

                {/* Sous-titre */}
                <p className="mx-auto mb-10 max-w-[52ch] text-base text-text-secondary leading-relaxed sm:text-lg">
                    Choisissez votre offre, remplissez le formulaire en 3 minutes
                    et payez directement via Wave ou Orange Money.
                    Activation sous 24&nbsp;h par nos techniciens au Sénégal.
                </p>

                {/* CTAs */}
                <div className="mb-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <ScrollLink
                        href="#offres"
                        className="inline-flex h-12 items-center gap-2 rounded-xl bg-brand px-7 text-sm font-semibold text-[#121A26] transition-all hover:brightness-110"
                    >
                        Voir nos offres
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </ScrollLink>
                    <ScrollLink
                        href="#comment-ca-marche"
                        className="inline-flex h-12 items-center rounded-xl border border-[#6FA3C8]/50 bg-[#6FA3C8]/5 px-7 text-sm font-semibold text-brand transition-colors hover:bg-[#6FA3C8]/12"
                    >
                        Comment ça marche
                    </ScrollLink>
                </div>

                {/* Barre de réassurance */}
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
