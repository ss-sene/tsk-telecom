// apps/admin/src/app/boutique/page.tsx
export const revalidate = 3600; // ISR — rebuild at most every hour

import type { Metadata } from 'next';
import Link              from 'next/link';

export const metadata: Metadata = {
    title:       'Boutique — Internet, Starlink & Équipements réseau',
    description: 'Forfaits Internet, kits Starlink et équipements réseau au Sénégal. Devis personnalisé via WhatsApp. Paiement Wave ou Orange Money.',
    alternates:  { canonical: '/boutique' },
    openGraph: {
        title:       'Boutique TDK Telecom — Internet, Starlink & Équipements',
        description: 'Forfaits Internet, Starlink et équipements réseau au Sénégal. Devis rapide via WhatsApp.',
        url:         '/boutique',
    },
};
import { prisma } from '@/core/db/prisma';
import { ProductCategory } from '@/generated/prisma/enums';
import { PublicHeader }     from '@/app/PublicHeader';
import { PublicFooter }     from '@/app/PublicFooter';
import type { ProductModel } from '@/generated/prisma/models/Product';

import { COMPANY } from '@/lib/company';

// ─── Config ───────────────────────────────────────────────────────────────────

const CONTACT_WHATSAPP = COMPANY.whatsappUrl;

const CATEGORY_LABELS: Partial<Record<ProductCategory, string>> = {
    INTERNET:   'Internet',
    STARLINK:   'Starlink',
    TELEPHONIE: 'Téléphonie',
    EQUIPEMENT: 'Équipement réseau',
    AUTRE:      'Autre',
};

const CATEGORY_BADGE: Record<ProductCategory, string> = {
    INTERNET:   'bg-blue-50   text-blue-700   ring-blue-600/20  dark:bg-blue-900/20  dark:text-blue-300  dark:ring-blue-400/30',
    STARLINK:   'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-900/20 dark:text-purple-300 dark:ring-purple-400/30',
    TELEPHONIE: 'bg-green-50  text-green-700  ring-green-600/20  dark:bg-green-900/20  dark:text-green-300  dark:ring-green-400/30',
    EQUIPEMENT: 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-900/20 dark:text-orange-300 dark:ring-orange-400/30',
    AUTRE:      'bg-gray-50   text-gray-600   ring-gray-500/20   dark:bg-slate-700    dark:text-slate-300  dark:ring-slate-600/40',
};

// Ordre d'affichage des sections
const CATEGORY_ORDER: ProductCategory[] = [
    ProductCategory.INTERNET,
    ProductCategory.STARLINK,
    ProductCategory.TELEPHONIE,
    ProductCategory.EQUIPEMENT,
    ProductCategory.AUTRE,
];

// ─── Composant carte ──────────────────────────────────────────────────────────

type ProductWithImage = ProductModel & { imageUrl?: string | null };

function ProductCard({ p, devisHref }: { p: ProductWithImage; devisHref: string }) {
    const visibleFeatures = p.features.slice(0, 4);

    return (
        <div className={`relative flex flex-col rounded-2xl border bg-white dark:bg-slate-800 transition-shadow hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,.12)] dark:hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,.4)] ${
            p.highlighted
                ? 'border-brand/30 shadow-[0_2px_12px_-2px_rgba(26,60,159,.18)] dark:border-brand/40'
                : 'border-gray-200 dark:border-slate-700/60 shadow-sm'
        }`}>

            {/* Badge populaire */}
            {p.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand px-3 py-0.5 text-xs font-bold text-white shadow-sm">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Populaire
                    </span>
                </div>
            )}

            {/* Image produit */}
            {p.imageUrl ? (
                <div className="h-44 flex items-center justify-center bg-gray-50 dark:bg-slate-800/60 rounded-t-2xl border-b border-gray-100 dark:border-slate-700/40 overflow-hidden px-6 py-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="max-h-full max-w-full object-contain"
                    />
                </div>
            ) : (
                <div className="h-44 flex items-center justify-center bg-gray-100 dark:bg-slate-700/40 rounded-t-2xl border-b border-gray-100 dark:border-slate-700/40">
                    <span className="text-3xl font-black text-gray-300 dark:text-slate-600">TDK</span>
                </div>
            )}

            <div className="flex flex-col flex-1 p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <span className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${CATEGORY_BADGE[p.category]}`}>
                        {CATEGORY_LABELS[p.category]}
                    </span>
                    {p.speed && (
                        <span className="shrink-0 text-xs font-mono font-semibold text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-700/60 rounded-lg px-2 py-0.5 border border-gray-100 dark:border-slate-700">
                            {p.speed}
                        </span>
                    )}
                </div>

                {/* Nom + prix */}
                <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 leading-snug">
                        {p.name}
                    </h3>
                    {p.priceXof != null && (
                        <span className="shrink-0 text-sm font-bold text-brand dark:text-brand-light">
                            A partir de {new Intl.NumberFormat('fr-FR').format(p.priceXof)}&nbsp;F
                        </span>
                    )}
                </div>
                {p.shortDescription && (
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 leading-relaxed">
                        {p.shortDescription}
                    </p>
                )}

                {/* Features */}
                {visibleFeatures.length > 0 && (
                    <ul className="mt-auto space-y-1.5 mb-6">
                        {visibleFeatures.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-300">
                                <svg className="mt-0.5 h-4 w-4 shrink-0 text-success" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                <span>{f}</span>
                            </li>
                        ))}
                        {p.features.length > 4 && (
                            <li className="text-xs text-gray-400 dark:text-slate-500 pl-6">
                                +{p.features.length - 4} autres caractéristiques
                            </li>
                        )}
                    </ul>
                )}

                {/* CTA */}
                <a
                    href={`${devisHref}&text=${encodeURIComponent(`Bonjour, je souhaite un devis pour : ${p.name}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-auto flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                        p.highlighted
                            ? 'bg-brand text-white hover:bg-brand-hover shadow-sm'
                            : 'bg-gray-50 dark:bg-slate-700/60 text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                >
                    Demander un devis
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </a>
            </div>
        </div>
    );
}

// ─── Composant section catégorie ──────────────────────────────────────────────

function CategorySection({
    category,
    products,
    devisHref,
}: {
    category: ProductCategory;
    products: ProductWithImage[];
    devisHref: string;
}) {
    if (products.length === 0) return null;

    return (
        <section className="mb-14">
            <div className="flex items-center gap-3 mb-6">
                <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100">
                    {CATEGORY_LABELS[category]}
                </h2>
                <span className="text-sm text-gray-400 dark:text-slate-500">
                    {products.length} produit{products.length > 1 ? 's' : ''}
                </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => (
                    <ProductCard key={p.id} p={p} devisHref={devisHref} />
                ))}
            </div>
        </section>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BoutiquePage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const params  = await searchParams;
    const ALL_CATS = Object.values(ProductCategory) as ProductCategory[];
    const catParam = ALL_CATS.includes(params.category as ProductCategory)
        ? (params.category as ProductCategory)
        : null;

    const allPublished = await prisma.product.findMany({
        where: {
            published: true,
            ...(catParam ? { category: catParam } : {}),
        },
        orderBy: [{ position: 'asc' }, { name: 'asc' }],
    });

    // Grouper par catégorie
    const grouped = CATEGORY_ORDER.reduce<Record<ProductCategory, ProductWithImage[]>>(
        (acc, cat) => {
            acc[cat] = (allPublished as ProductWithImage[]).filter(p => p.category === cat);
            return acc;
        },
        {} as Record<ProductCategory, ProductWithImage[]>,
    );

    // Comptages pour les onglets (tous produits publiés, sans filtre catégorie)
    const allForCount = catParam
        ? await prisma.product.findMany({ where: { published: true }, select: { category: true } })
        : allPublished;
    const countByCategory = allForCount.reduce<Partial<Record<ProductCategory, number>>>((acc, p) => {
        acc[p.category] = (acc[p.category] ?? 0) + 1;
        return acc;
    }, {});
    const totalCount = allForCount.length;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100">

            {/* ── Header ── */}
            <PublicHeader />

            <main className="mx-auto max-w-6xl px-5 py-12">

                {/* ── Hero ── */}
                <div className="mb-10">
                    <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-slate-100 mb-2">
                        Notre boutique
                    </h1>
                    <p className="text-base text-gray-500 dark:text-slate-400 max-w-xl">
                        Équipements réseau, forfaits internet et solutions Starlink. Contactez-nous pour un devis personnalisé.
                    </p>
                </div>

                {/* ── Filtres catégorie ── */}
                <div className="mb-10 flex flex-wrap gap-2">
                    <Link
                        href="/boutique"
                        className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                            !catParam
                                ? 'bg-brand text-white shadow-sm'
                                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        Tous <span className="opacity-70">({totalCount})</span>
                    </Link>
                    {CATEGORY_ORDER.filter(cat => (countByCategory[cat] ?? 0) > 0).map(cat => (
                        <Link
                            key={cat}
                            href={`/boutique?category=${cat}`}
                            className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                                catParam === cat
                                    ? 'bg-brand text-white shadow-sm'
                                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            {CATEGORY_LABELS[cat]} <span className="opacity-70">({countByCategory[cat]})</span>
                        </Link>
                    ))}
                </div>

                {/* ── Contenu ── */}
                {allPublished.length === 0 ? (
                    <div className="rounded-2xl border border-gray-200 dark:border-slate-700/60 bg-gray-50 dark:bg-slate-800/40 py-24 text-center">
                        <p className="text-gray-400 dark:text-slate-500 text-sm">Aucun produit disponible pour le moment.</p>
                    </div>
                ) : catParam ? (
                    /* Vue filtrée — grille plate */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allPublished.map(p => (
                            <ProductCard key={p.id} p={p} devisHref={CONTACT_WHATSAPP} />
                        ))}
                    </div>
                ) : (
                    /* Vue toutes catégories — sections */
                    CATEGORY_ORDER.map(cat => (
                        <CategorySection
                            key={cat}
                            category={cat}
                            products={grouped[cat]}
                            devisHref={CONTACT_WHATSAPP}
                        />
                    ))
                )}

                {/* ── CTA contact ── */}
                <div className="mt-16 rounded-2xl bg-brand-light dark:bg-brand/10 border border-brand/20 dark:border-brand/30 px-6 py-8 text-center">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-2">
                        Vous avez un projet spécifique ?
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-5 max-w-md mx-auto">
                        Notre équipe technique vous conseille et établit un devis sur mesure pour votre installation.
                    </p>
                    <a
                        href={CONTACT_WHATSAPP}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover transition-colors shadow-sm"
                    >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.118 1.527 5.848L.057 23.5l5.797-1.521A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.825 9.825 0 01-5.012-1.37l-.36-.214-3.719.975.993-3.624-.235-.373A9.818 9.818 0 012.182 12C2.182 6.591 6.591 2.182 12 2.182S21.818 6.591 21.818 12 17.409 21.818 12 21.818z" />
                        </svg>
                        Nous contacter sur WhatsApp
                    </a>
                </div>
            </main>

            <PublicFooter />

        </div>
    );
}
