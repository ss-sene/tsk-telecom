// apps/admin/src/app/admin/catalogue/page.tsx
import Link from 'next/link';
import { prisma } from '@/core/db/prisma';
import { ProductCategory } from '@/generated/prisma/enums';
import { PublishToggle } from './components/PublishToggle';
import { DeleteButton } from './components/DeleteButton';

const CATEGORY_LABELS: Record<ProductCategory, string> = {
    INTERNET:    'Internet',
    STARLINK:    'Starlink',
    TELEPHONIE:  'Téléphonie',
    EQUIPEMENT:  'Équipement',
    AUTRE:       'Autre',
};

const CATEGORY_COLORS: Record<ProductCategory, string> = {
    INTERNET:   'bg-blue-50   text-blue-700   ring-blue-600/20  dark:bg-blue-900/20  dark:text-blue-300  dark:ring-blue-400/30',
    STARLINK:   'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-900/20 dark:text-purple-300 dark:ring-purple-400/30',
    TELEPHONIE: 'bg-green-50  text-green-700  ring-green-600/20  dark:bg-green-900/20  dark:text-green-300  dark:ring-green-400/30',
    EQUIPEMENT: 'bg-orange-50 text-orange-700 ring-orange-600/20 dark:bg-orange-900/20 dark:text-orange-300 dark:ring-orange-400/30',
    AUTRE:      'bg-gray-50   text-gray-600   ring-gray-500/20   dark:bg-slate-700    dark:text-slate-300  dark:ring-slate-600/40',
};

const ALL_CATEGORIES = Object.values(ProductCategory);

export default async function CataloguePage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}) {
    const params   = await searchParams;
    const catParam = ALL_CATEGORIES.includes(params.category as ProductCategory)
        ? (params.category as ProductCategory)
        : null;
    const search   = params.search?.trim() ?? '';
    const page     = Math.max(1, parseInt(params.page ?? '1', 10));
    const PAGE_SIZE = 50;

    const where = {
        ...(catParam ? { category: catParam } : {}),
        ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
    };

    const [products, total, counts] = await Promise.all([
        prisma.product.findMany({
            where,
            orderBy: [{ position: 'asc' }, { name: 'asc' }],
            skip:  (page - 1) * PAGE_SIZE,
            take:  PAGE_SIZE,
        }),
        prisma.product.count({ where }),
        prisma.product.groupBy({ by: ['category'], _count: { id: true } }),
    ]);

    const countMap = Object.fromEntries(counts.map(c => [c.category, c._count.id]));
    const totalAll = counts.reduce((s, c) => s + c._count.id, 0);
    const totalPages = Math.ceil(total / PAGE_SIZE);

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-slate-100">Catalogue</h1>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">{totalAll} produits au total</p>
                </div>
                <Link
                    href="/admin/catalogue/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover transition-colors shadow-sm"
                >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouveau produit
                </Link>
            </div>

            {/* Filtres */}
            <div className="mb-5 flex flex-wrap items-center gap-2">
                {/* Search */}
                <form method="GET" className="flex-1 min-w-[180px] max-w-xs">
                    {catParam && <input type="hidden" name="category" value={catParam} />}
                    <div className="relative">
                        <input
                            type="search"
                            name="search"
                            defaultValue={search}
                            placeholder="Rechercher…"
                            className="w-full rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/50 transition"
                        />
                        <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                        </svg>
                    </div>
                </form>

                {/* Category tabs */}
                <div className="flex flex-wrap gap-1.5">
                    <Link
                        href="/admin/catalogue"
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                            !catParam
                                ? 'bg-brand text-white'
                                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                        }`}
                    >
                        Tous <span className="opacity-70">({totalAll})</span>
                    </Link>
                    {ALL_CATEGORIES.map(cat => (
                        <Link
                            key={cat}
                            href={`/admin/catalogue?category=${cat}`}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                catParam === cat
                                    ? 'bg-brand text-white'
                                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                            }`}
                        >
                            {CATEGORY_LABELS[cat]} <span className="opacity-70">({countMap[cat] ?? 0})</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Tableau */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 shadow-sm">
                {products.length === 0 ? (
                    <div className="py-20 text-center text-sm text-gray-400 dark:text-slate-500">
                        Aucun produit trouvé.
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700/60">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-800/60">
                                <th className="py-3 pl-5 pr-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Produit</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400 hidden sm:table-cell">Catégorie</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400 hidden md:table-cell">Prix</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400 hidden lg:table-cell">Débit</th>
                                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Publié</th>
                                <th className="py-3 pl-3 pr-5 text-right text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700/40">
                            {products.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                                    {/* Nom */}
                                    <td className="py-3.5 pl-5 pr-3">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-gray-900 dark:text-slate-100 line-clamp-1">{p.name}</span>
                                            {p.shortDescription && (
                                                <span className="mt-0.5 text-xs text-gray-400 dark:text-slate-500 line-clamp-1">{p.shortDescription}</span>
                                            )}
                                        </div>
                                    </td>
                                    {/* Catégorie */}
                                    <td className="px-3 py-3.5 hidden sm:table-cell">
                                        <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${CATEGORY_COLORS[p.category]}`}>
                                            {CATEGORY_LABELS[p.category]}
                                        </span>
                                    </td>
                                    {/* Prix */}
                                    <td className="px-3 py-3.5 text-sm text-gray-600 dark:text-slate-300 hidden md:table-cell whitespace-nowrap">
                                        {p.priceXof
                                            ? `${p.priceXof.toLocaleString('fr-FR')} XOF${p.priceUnit ? ` / ${p.priceUnit}` : ''}`
                                            : <span className="text-gray-400 dark:text-slate-500 italic">Sur devis</span>
                                        }
                                    </td>
                                    {/* Débit */}
                                    <td className="px-3 py-3.5 text-sm text-gray-500 dark:text-slate-400 hidden lg:table-cell">
                                        {p.speed ?? '—'}
                                    </td>
                                    {/* Toggle publié */}
                                    <td className="px-3 py-3.5 text-center">
                                        <div className="flex justify-center">
                                            <PublishToggle id={p.id} published={p.published} />
                                        </div>
                                    </td>
                                    {/* Actions */}
                                    <td className="py-3.5 pl-3 pr-5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/admin/catalogue/${p.id}`}
                                                className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                                            >
                                                Modifier
                                            </Link>
                                            <DeleteButton id={p.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-slate-400">
                    <span>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} sur {total}</span>
                    <div className="flex gap-2">
                        {page > 1 && (
                            <Link
                                href={`/admin/catalogue?${new URLSearchParams({ ...(catParam ? { category: catParam } : {}), ...(search ? { search } : {}), page: String(page - 1) })}`}
                                className="rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                ← Précédent
                            </Link>
                        )}
                        {page < totalPages && (
                            <Link
                                href={`/admin/catalogue?${new URLSearchParams({ ...(catParam ? { category: catParam } : {}), ...(search ? { search } : {}), page: String(page + 1) })}`}
                                className="rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                            >
                                Suivant →
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
