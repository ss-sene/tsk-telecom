// apps/admin/src/app/starlink/page.tsx
export const revalidate = 86400; // ISR — static data, rebuild daily

import type { Metadata } from 'next';
import Link              from 'next/link';
import { PublicHeader }  from '@/app/PublicHeader';
import { PublicFooter }  from '@/app/PublicFooter';
import { COMPANY }       from '@/lib/company';

export const metadata: Metadata = {
    title:       'Starlink Sénégal — Installation Internet Satellite | Partenaire Officiel',
    description: 'TDK Telecom, partenaire officiel Starlink au Sénégal. Internet satellite partout, même en zone rurale. Abonnements dès 22 000 F/mois. Installation par nos techniciens. Paiement Wave ou Orange Money.',
    alternates:  { canonical: '/starlink' },
    openGraph: {
        title:       'Starlink au Sénégal — Installation par Techniciens Locaux | TDK Telecom',
        description: 'Partenaire officiel Starlink. Internet satellite partout au Sénégal. Dès 22 000 F/mois. Installation & activation par nos équipes. Wave ou Orange Money.',
        url:         '/starlink',
        images: [{ url: '/og-image.png', width: 1424, height: 752, alt: 'Starlink Sénégal — TDK Telecom' }],
    },
};

// ─── Config ───────────────────────────────────────────────────────────────────

const CONTACT_DEVIS = `${COMPANY.whatsappBase}?text=${encodeURIComponent('Bonjour, je souhaite un devis pour Starlink au Sénégal.')}`;

// ─── Data statique ────────────────────────────────────────────────────────────

const AVANTAGES = [
    {
        title: 'Couverture nationale par satellite',
        desc:  "Starlink couvre l'intégralité du territoire sénégalais, y compris les zones rurales et les localités sans infrastructure filaire.",
        icon:  'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
        title: 'Haut débit, faible latence',
        desc:  'Jusqu\'à 220 Mbps en débit descendant et une latence inférieure à 40 ms — suffisant pour le streaming 4K, la vidéoconférence et le télétravail.',
        icon:  'M13 10V3L4 14h7v7l9-11h-7z',
    },
    {
        title: 'Installation par nos techniciens',
        desc:  'Notre équipe locale gère l\'installation de l\'antenne, l\'orientation vers la constellation et la mise en service. Vous n\'avez rien à faire.',
        icon:  'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    },
    {
        title: 'Paiement local Wave & Orange Money',
        desc:  'Pas besoin de carte bancaire internationale. Réglez votre abonnement directement depuis votre application Wave ou Orange Money.',
        icon:  'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z',
    },
];

const STEPS = [
    {
        num:   '01',
        title: 'Demandez votre devis',
        desc:  'Contactez-nous via WhatsApp en indiquant votre localité. Notre équipe évalue la faisabilité et vous répond sous 24 heures.',
    },
    {
        num:   '02',
        title: 'Évaluation du site',
        desc:  'Un technicien TDK se déplace pour vérifier la vue dégagée vers le ciel et définir le meilleur emplacement pour l\'antenne.',
    },
    {
        num:   '03',
        title: 'Installation & activation',
        desc:  'Pose de l\'antenne Starlink, câblage, configuration du réseau Wi-Fi et activation du service. L\'installation prend en général une demi-journée.',
    },
    {
        num:   '04',
        title: 'Connexion opérationnelle',
        desc:  'Votre connexion satellite est active. Vous profitez d\'un internet haut débit où que vous soyez au Sénégal, payable chaque mois en mobile money.',
    },
];

const STARLINK_PLANS = [
    {
        id:           'lite',
        name:         'Résidentiel Lite',
        target:       'Particuliers · usage quotidien',
        priceMonthly: 22_000,
        highlighted:  false,
        badge:        null as string | null,
        features: [
            'Débit descendant 80 – 200 Mbps',
            'Débit montant 15 – 35 Mbps',
            'Latence < 60 ms',
            'Couverture nationale par satellite',
            'Streaming & navigation sans coupure',
            'Sans engagement de durée',
        ],
    },
    {
        id:           'residential',
        name:         'Résidentiel',
        target:       'Particuliers · usage intensif',
        priceMonthly: 30_000,
        highlighted:  true,
        badge:        'Le plus demandé' as string | null,
        features: [
            'Débit descendant 135 – 305 Mbps',
            'Débit montant 20 – 40 Mbps',
            'Latence < 40 ms',
            'Streaming 4K & visioconférence HD',
            'Plusieurs appareils simultanés',
            'Sans engagement de durée',
        ],
    },
    {
        id:           'priority-local',
        name:         'Prioritaire Local',
        target:       'PME, ONG & institutions',
        priceMonthly: 24_000,
        highlighted:  false,
        badge:        'Business' as string | null,
        features: [
            'Bande passante prioritaire réseau',
            'Connectivité fiable en zones complexes',
            'Idéal PME, établissements, projets',
            'Support dédié TDK Telecom',
            'Paiement Wave ou Orange Money',
        ],
    },
    {
        id:           'mobile',
        name:         'Mobile / Itinérance',
        target:       'Professionnels nomades',
        priceMonthly: 30_000,
        highlighted:  false,
        badge:        null as string | null,
        features: [
            'Utilisation en déplacement',
            'Multi-zones au Sénégal',
            'Idéal chantiers, événements, terrain',
            'Kit compact portable',
            'Connexion là où vous êtes',
        ],
    },
];

const KITS = [
    {
        id:    'mini',
        name:  'Kit Starlink Mini',
        price: 117_000,
        desc:  'Compact et léger. Idéal pour un usage nomade, un logement ou des espaces restreints.',
        features: [
            'Antenne compacte haute performance',
            'Routeur Wi-Fi inclus',
            'Câble d\'alimentation 10 m',
            'Adapté aux usages mobiles',
        ],
        compatible: 'Résidentiel Lite · Mobile',
    },
    {
        id:    'standard',
        name:  'Kit Starlink Standard',
        price: 146_000,
        desc:  'Le kit complet recommandé pour une installation résidentielle fixe.',
        features: [
            'Grande antenne haute performance',
            'Routeur Wi-Fi double bande',
            'Câble 15 m',
            'Pied mural & support inclus',
        ],
        compatible: 'Résidentiel · Prioritaire Local',
    },
];

const FAQ = [
    {
        q: 'Starlink fonctionne-t-il partout au Sénégal ?',
        a: "Oui. La constellation de satellites Starlink couvre l'ensemble du territoire sénégalais. C'est la solution idéale pour les zones rurales, les villages éloignés et toute localité sans accès fibre ou 4G stable.",
    },
    {
        q: 'Quelle est la différence entre Starlink et une box 4G ?',
        a: "Starlink utilise des satellites en orbite basse (550 km) pour délivrer un signal direct, indépendant de toute infrastructure terrestre. La 4G dépend des antennes relais. Dans les zones mal couvertes, Starlink est beaucoup plus fiable et rapide.",
    },
    {
        q: 'L\'installation est-elle complexe ?',
        a: "Non. TDK Telecom prend en charge toute l'installation — antenne, câblage, configuration Wi-Fi. Il suffit d'avoir une vue dégagée vers le ciel (toit, terrasse ou mur extérieur). L'installation prend généralement une demi-journée.",
    },
    {
        q: 'Y a-t-il un engagement de durée ?',
        a: "L'abonnement Starlink résidentiel est sans engagement de durée minimale. Vous pouvez suspendre ou arrêter à tout moment depuis l'application Starlink.",
    },
    {
        q: 'Comment se fait le paiement ?',
        a: "Vous payez votre abonnement mensuel via Wave ou Orange Money, directement depuis votre téléphone. Pas besoin de carte bancaire internationale. Le kit Starlink est facturé séparément à l'installation.",
    },
    {
        q: 'Puis-je utiliser Starlink Business pour mon entreprise ?',
        a: "Oui. Starlink Business offre un débit prioritaire, une latence réduite et un SLA dédié — idéal pour les entreprises, ONG et institutions qui ont besoin d'une connexion fiable. Contactez-nous pour un devis personnalisé.",
    },
];

const FAQ_JSON_LD = {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: FAQ.map(item => ({
        '@type': 'Question',
        name:    item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
};

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tdktelecom.sn';

const BREADCRUMB_LD = {
    '@context':        'https://schema.org',
    '@type':           'BreadcrumbList',
    'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Accueil',  'item': `${APP_URL}/`        },
        { '@type': 'ListItem', 'position': 2, 'name': 'Starlink', 'item': `${APP_URL}/starlink` },
    ],
};

const STARLINK_SERVICE_LD = {
    '@context':    'https://schema.org',
    '@type':       'Service',
    '@id':         `${APP_URL}/starlink#service`,
    'name':        'Installation Starlink au Sénégal',
    'description': "TDK Telecom installe et active Starlink partout au Sénégal. Internet satellite haut débit, même en zone rurale. Abonnements dès 22 000 F/mois.",
    'serviceType': 'Internet Service Provider — Satellite',
    'provider':    { '@id': `${APP_URL}/#organization` },
    'areaServed':  { '@type': 'Country', 'name': 'Sénégal' },
    'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name':  'Abonnements Starlink',
        'itemListElement': STARLINK_PLANS.map((plan, i) => ({
            '@type':    'Offer',
            'position': i + 1,
            'name':     `Starlink ${plan.name}`,
            'price':    plan.priceMonthly,
            'priceCurrency': 'XOF',
            'priceSpecification': {
                '@type':            'UnitPriceSpecification',
                'price':            plan.priceMonthly,
                'priceCurrency':    'XOF',
                'unitText':         'month',
                'billingIncrement': 1,
            },
        })),
    },
};

const TRUST = [
    { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', label: 'Installation garantie' },
    { icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', label: 'Techniciens locaux' },
    { icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', label: 'Couverture nationale' },
    { icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z', label: 'Paiement mobile money' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StarlinkPage() {

    return (
        <div className="min-h-screen bg-surface-page">

            {/* ── Header ── */}
            <PublicHeader />

            <main>

                {/* ── HERO — section intentionnellement sombre (branding spatial Starlink) ── */}
                <section className="relative overflow-hidden bg-[#080E2A] px-5 py-20 sm:py-28 lg:py-36 text-white">
                    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(26,60,159,.55),transparent)]" />
                        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
                        <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl" />
                    </div>

                    <div className="relative mx-auto max-w-3xl text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" aria-hidden="true" />
                            Internet par satellite — disponible partout au Sénégal
                        </div>

                        <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-6xl mb-6 leading-[1.05]">
                            Internet haut débit{' '}
                            <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                                partout au Sénégal
                            </span>
                        </h1>

                        <p className="mx-auto mb-8 max-w-[44ch] text-base text-white/70 sm:text-lg leading-relaxed">
                            TDK Telecom installe et active Starlink dans votre zone.
                            Connexion satellite, paiement mobile money, techniciens locaux.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <a
                                href={CONTACT_DEVIS}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-[#121A26] hover:bg-brand-hover transition-colors"
                            >
                                Demander un devis
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                            <a
                                href="#comment-ca-marche"
                                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/8 px-6 py-3 text-sm font-semibold text-white hover:bg-white/15 transition-colors backdrop-blur-sm"
                            >
                                Comment ça marche
                            </a>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/50">
                            {TRUST.map(({ icon, label }) => (
                                <span key={label} className="flex items-center gap-1.5">
                                    <svg className="h-3.5 w-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                                    </svg>
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── AVANTAGES ── */}
                <section className="bg-surface-page px-5 py-20 sm:py-24">
                    <div className="mx-auto max-w-6xl">
                        <div className="text-center mb-14">
                            <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Pourquoi Starlink</p>
                            <h2 className="text-3xl font-black tracking-[-0.03em] text-text-base sm:text-4xl">
                                Internet fiable, même en zone rurale
                            </h2>
                            <p className="mt-3 text-base text-text-muted max-w-[46ch] mx-auto">
                                La technologie satellite de SpaceX, installée et gérée localement par les équipes TDK Telecom.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {AVANTAGES.map(a => (
                                <div
                                    key={a.title}
                                    className="flex gap-4 rounded-2xl bg-surface-section p-6 ring-1 ring-border-faint"
                                >
                                    <div className="shrink-0 h-11 w-11 flex items-center justify-center rounded-xl bg-brand-muted ring-1 ring-brand/10">
                                        <svg className="h-5 w-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={a.icon} />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-extrabold text-text-base mb-1">{a.title}</h3>
                                        <p className="text-sm text-text-muted leading-relaxed">{a.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── ABONNEMENTS STARLINK ── */}
                <section id="offres" className="bg-surface-section px-5 py-20 sm:py-24 scroll-mt-20">
                    <div className="mx-auto max-w-6xl">
                        <div className="text-center mb-14">
                            <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Abonnements</p>
                            <h2 className="text-3xl font-black tracking-[-0.03em] text-text-base sm:text-4xl">
                                Choisissez votre formule Starlink
                            </h2>
                            <p className="mt-3 text-base text-text-muted max-w-[46ch] mx-auto">
                                Résidentiel pour les particuliers, Prioritaire Local pour les PME, Mobile pour les professionnels nomades.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {STARLINK_PLANS.map(plan => (
                                <article
                                    key={plan.id}
                                    className={`relative flex flex-col rounded-2xl p-6 ring-2 ${
                                        plan.highlighted
                                            ? 'ring-brand bg-surface-card shadow-[var(--shadow-card-md)]'
                                            : 'ring-border-default bg-surface-card shadow-[var(--shadow-card)]'
                                    }`}
                                >
                                    {plan.highlighted && (
                                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-4 py-1 text-xs font-bold text-[#121A26] shadow-sm">
                                            Le plus demandé
                                        </div>
                                    )}
                                    {plan.badge && !plan.highlighted && (
                                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand px-4 py-1 text-xs font-bold text-[#121A26] shadow-sm">
                                            {plan.badge}
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <p className="text-xs font-semibold text-text-faint mb-1">{plan.target}</p>
                                        <h3 className={`text-base font-extrabold mb-4 ${plan.highlighted ? 'text-brand' : 'text-text-base'}`}>
                                            {plan.name}
                                        </h3>

                                        <div className="mb-5">
                                            <span className="text-2xl font-black text-text-base">
                                                {plan.priceMonthly.toLocaleString('fr-FR')} F
                                            </span>
                                            <span className="text-sm text-text-faint">/mois</span>
                                        </div>

                                        <ul className="space-y-2 mb-6">
                                            {plan.features.map(f => (
                                                <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                                                    <svg className="h-4 w-4 flex-none text-success mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <a
                                        href={`${COMPANY.whatsappBase}?text=${encodeURIComponent(`Bonjour, je souhaite souscrire à l'offre Starlink : ${plan.name}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors ${
                                            plan.highlighted
                                                ? 'bg-brand text-[#121A26] hover:bg-brand-hover'
                                                : 'border-2 border-border-default text-text-secondary hover:border-brand hover:text-brand'
                                        }`}
                                    >
                                        Souscrire
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </a>
                                </article>
                            ))}
                        </div>

                        <p className="mt-8 text-center text-xs text-text-faint">
                            Tarifs officiels Starlink SpaceX au Sénégal. Frais d'installation TDK Telecom en sus — contactez-nous pour un devis complet.
                        </p>
                    </div>
                </section>

                {/* ── KITS & ÉQUIPEMENTS ── */}
                <section className="bg-surface-page px-5 py-16 sm:py-20">
                    <div className="mx-auto max-w-3xl">
                        <div className="text-center mb-10">
                            <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Équipements</p>
                            <h2 className="text-2xl font-black tracking-[-0.03em] text-text-base sm:text-3xl">
                                Kits Starlink disponibles
                            </h2>
                            <p className="mt-3 text-sm text-text-muted max-w-[44ch] mx-auto">
                                Frais de transport : 14 000 F. Installation par nos techniciens incluse dans le devis.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {KITS.map(kit => (
                                <div key={kit.id} className="rounded-2xl border border-border-default bg-surface-section p-6">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <h3 className="text-base font-extrabold text-text-base">{kit.name}</h3>
                                        <span className="shrink-0 text-base font-black text-brand">
                                            {kit.price.toLocaleString('fr-FR')} F
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-muted mb-4 leading-relaxed">{kit.desc}</p>
                                    <ul className="space-y-1.5 mb-4">
                                        {kit.features.map(f => (
                                            <li key={f} className="flex items-center gap-2 text-sm text-text-muted">
                                                <svg className="h-3.5 w-3.5 flex-none text-success" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <p className="text-xs text-text-faint">Compatible : {kit.compatible}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-text-faint mb-2">Besoin d&apos;autres équipements réseau ?</p>
                            <Link
                                href="/boutique"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-hover transition-colors"
                            >
                                Voir tous les équipements en boutique
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ── COMMENT ÇA MARCHE ── */}
                <section id="comment-ca-marche" className="bg-surface-section px-5 py-20 sm:py-24 scroll-mt-20">
                    <div className="mx-auto max-w-6xl">
                        <div className="text-center mb-14">
                            <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Installation</p>
                            <h2 className="text-3xl font-black tracking-[-0.03em] text-text-base sm:text-4xl">
                                Comment ça marche
                            </h2>
                            <p className="mt-3 text-base text-text-muted max-w-[44ch] mx-auto">
                                Du premier contact à la connexion active, nos techniciens vous accompagnent à chaque étape.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                            <div className="hidden md:block absolute top-[52px] left-[calc(25%+24px)] right-[calc(25%+24px)] h-px bg-border-default z-0" aria-hidden="true" />

                            {STEPS.map(step => (
                                <div key={step.num} className="relative z-10 flex flex-col rounded-2xl bg-surface-card p-6 ring-1 ring-border-faint shadow-[var(--shadow-card)]">
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-base font-black text-[#121A26] shrink-0">
                                        {step.num}
                                    </div>
                                    <h3 className="text-sm font-extrabold text-text-base mb-2">{step.title}</h3>
                                    <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── PAIEMENT LOCAL ── */}
                <section className="bg-surface-page px-5 py-16 sm:py-20">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Paiement</p>
                        <h2 className="text-2xl font-black tracking-[-0.03em] text-text-base sm:text-3xl mb-4">
                            Payez depuis votre téléphone
                        </h2>
                        <p className="text-sm text-text-muted max-w-[42ch] mx-auto mb-8 leading-relaxed">
                            Pas de carte bancaire internationale requise. Réglez votre abonnement mensuel Starlink directement via Wave ou Orange Money.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {/* Wave */}
                            <div className="flex items-center gap-3 rounded-2xl border border-border-default bg-surface-card px-6 py-4 shadow-[var(--shadow-card)] min-w-[160px]">
                                <div className="h-10 w-10 rounded-xl bg-[#1BA8E0]/10 flex items-center justify-center shrink-0">
                                    <span className="text-[#1BA8E0] font-black text-sm">W</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-text-base">Wave</p>
                                    <p className="text-xs text-text-faint">Paiement instantané</p>
                                </div>
                            </div>
                            {/* Orange Money */}
                            <div className="flex items-center gap-3 rounded-2xl border border-border-default bg-surface-card px-6 py-4 shadow-[var(--shadow-card)] min-w-[160px]">
                                <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                                    <span className="text-orange-500 font-black text-sm">OM</span>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-text-base">Orange Money</p>
                                    <p className="text-xs text-text-faint">Paiement instantané</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FAQ ── */}
                <section id="faq" className="bg-surface-section px-5 py-20 sm:py-24 scroll-mt-20">
                    <div className="mx-auto max-w-2xl">
                        <div className="text-center mb-14">
                            <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Questions fréquentes</p>
                            <h2 className="text-3xl font-black tracking-[-0.03em] text-text-base sm:text-4xl">
                                Tout ce que vous devez savoir
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {FAQ.map((item, i) => (
                                <details
                                    key={i}
                                    className="group rounded-2xl border border-border-faint bg-surface-card transition-all open:border-border-default open:shadow-[var(--shadow-card)] focus-within:ring-2 focus-within:ring-brand/30"
                                >
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 select-none">
                                        <span className="text-sm font-semibold text-text-base">{item.q}</span>
                                        <span className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-surface-section group-open:bg-brand-light transition-colors">
                                            <svg
                                                className="h-4 w-4 text-text-faint group-open:text-brand group-open:rotate-180 transition-transform duration-200"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </span>
                                    </summary>
                                    <p className="px-5 pb-5 pt-1 text-sm text-text-muted leading-relaxed">
                                        {item.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CTA FINALE ── */}
                <section className="bg-surface-section px-5 py-16 sm:py-20">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-black tracking-[-0.03em] text-text-base sm:text-4xl mb-4">
                            Prêt à vous connecter ?
                        </h2>
                        <p className="text-base text-text-secondary max-w-[38ch] mx-auto mb-8 leading-relaxed">
                            Contactez notre équipe pour un devis gratuit et une évaluation de votre site d&apos;installation.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <a
                                href={CONTACT_DEVIS}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-[#121A26] hover:bg-brand-hover transition-colors shadow-sm"
                            >
                                Demander un devis gratuit
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </a>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-xl border border-border-default bg-transparent px-6 py-3 text-sm font-semibold text-text-secondary hover:bg-surface-raised transition-colors"
                            >
                                Voir nos forfaits Internet
                            </Link>
                        </div>
                    </div>
                </section>

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_LD) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(STARLINK_SERVICE_LD) }}
                />
            </main>

            <PublicFooter />

        </div>
    );
}
