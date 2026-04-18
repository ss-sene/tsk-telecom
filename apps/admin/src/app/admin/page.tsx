// apps/admin/src/app/admin/page.tsx
import { prisma } from '@/core/db/prisma';
import { PaymentStatus, PaymentProvider, Prisma } from '@/generated/prisma/client';
import Link from 'next/link';
import { CustomListbox } from '@/components/ui/CustomListbox';
import { StatusUpdater } from './components/StatusUpdater';

const PROVIDER_LABELS: Record<PaymentProvider, string> = {
    WAVE:         'Wave',
    ORANGE_MONEY: 'Orange Money',
};

const STATUS_OPTIONS = [
    { value: 'SUCCESS',  label: 'Confirmé' },
    { value: 'PENDING',  label: 'En attente' },
    { value: 'FAILED',   label: 'Échoué' },
    { value: 'REFUNDED', label: 'Remboursé' },
];

const PROVIDER_OPTIONS = [
    { value: 'WAVE',         label: 'Wave' },
    { value: 'ORANGE_MONEY', label: 'Orange Money' },
];

const PAGE_SIZE = 25;

// ── Data fetching ────────────────────────────────────────────────────────────
async function getDashboardData(params: { [key: string]: string | undefined }) {
    const where: Prisma.PaymentWhereInput = {};

    if (params.status)   where.status   = params.status   as PaymentStatus;
    if (params.provider) where.provider = params.provider as PaymentProvider;

    const clientFilter: Prisma.ClientWhereInput = {};
    if (params.villageId) clientFilter.villageId = params.villageId;
    if (params.search?.trim()) {
        const s = params.search.trim();
        clientFilter.OR = [
            { firstName: { contains: s, mode: 'insensitive' } },
            { lastName:  { contains: s, mode: 'insensitive' } },
            { phone:     { contains: s } },
        ];
    }
    if (Object.keys(clientFilter).length > 0) where.client = clientFilter;

    const allowedSortFields = ['createdAt', 'amount', 'status', 'provider'];
    const sortBy    = allowedSortFields.includes(params.sortBy ?? '') ? params.sortBy! : 'createdAt';
    const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';
    const page      = Math.max(1, parseInt(params.page ?? '1', 10));
    const skip      = (page - 1) * PAGE_SIZE;

    const [payments, totalCount, aggregations] = await Promise.all([
        prisma.payment.findMany({
            where,
            orderBy: { [sortBy]: sortOrder },
            skip,
            take: PAGE_SIZE,
            include: { client: { include: { village: true } } },
        }),
        prisma.payment.count({ where }),
        // KPIs respectent les filtres actifs
        prisma.payment.groupBy({
            by:    ['status'],
            where,
            _sum:   { amount: true },
            _count: { id: true },
        }),
    ]);

    const stats = aggregations.reduce(
        (acc, curr) => {
            if (curr.status === PaymentStatus.SUCCESS) {
                acc.revenue      += curr._sum.amount ?? 0;
                acc.successCount += curr._count.id;
            }
            acc.totalCount += curr._count.id;
            return acc;
        },
        { revenue: 0, successCount: 0, totalCount: 0 },
    );

    return { payments, totalCount, stats, page };
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function AdminDashboard(
    props: { searchParams: Promise<{ [key: string]: string | undefined }> },
) {
    const params = await props.searchParams;

    const [{ payments, totalCount, stats, page }, allVillages] = await Promise.all([
        getDashboardData(params),
        prisma.village.findMany({ orderBy: { titre: 'asc' } }),
    ]);

    const VILLAGE_OPTIONS = allVillages.map(v => ({
        value: v.id,
        label: v.titre ?? 'Sans nom',
    }));

    const totalPages     = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const conversionRate = stats.totalCount > 0
        ? Math.round((stats.successCount / stats.totalCount) * 100)
        : 0;

    const formKey = new URLSearchParams(params as Record<string, string>).toString();

    const pageLink = (p: number) => {
        const q = new URLSearchParams(params as Record<string, string>);
        q.set('page', String(p));
        return `/admin?${q.toString()}`;
    };

    return (
        <div className="min-h-screen bg-card dark:bg-slate-900 px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* PAGE TITLE */}
                <div>
                    <h1 className="text-xl font-extrabold text-gray-900 dark:text-slate-100">Transactions</h1>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
                        {totalCount} résultat{totalCount !== 1 ? 's' : ''}
                        {Object.keys(params).some(k => ['status','provider','villageId','search'].includes(k) && params[k])
                            ? ' avec les filtres actifs'
                            : ' au total'}
                    </p>
                </div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        label="Revenu validé"
                        value={`${stats.revenue.toLocaleString('fr-FR')} FCFA`}
                        accent={false}
                    />
                    <StatCard
                        label="Transactions réussies"
                        value={String(stats.successCount)}
                        accent={false}
                    />
                    <StatCard
                        label="Taux de conversion"
                        value={`${conversionRate} %`}
                        accent={true}
                    />
                </div>

                {/* FILTERS */}
                <form
                    key={formKey}
                    action="/admin"
                    method="GET"
                    className="rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm ring-1 ring-gray-200 dark:ring-slate-700 flex flex-col lg:flex-row items-end gap-3"
                >
                    <div className="w-full lg:flex-[2]">
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                            Recherche
                        </label>
                        <input
                            type="search"
                            name="search"
                            defaultValue={params.search}
                            placeholder="Nom, téléphone…"
                            className="block h-11 w-full rounded-xl border-0 px-4 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-700 ring-1 ring-inset ring-gray-200 dark:ring-slate-600 focus:ring-2 focus:ring-brand outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500"
                        />
                    </div>
                    <div className="w-full lg:flex-1">
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Statut</label>
                        <CustomListbox name="status" options={STATUS_OPTIONS} defaultValue={params.status} placeholder="Tous les statuts" />
                    </div>
                    <div className="w-full lg:flex-1">
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Opérateur</label>
                        <CustomListbox name="provider" options={PROVIDER_OPTIONS} defaultValue={params.provider} placeholder="Tous" />
                    </div>
                    <div className="w-full lg:flex-1">
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Zone</label>
                        <CustomListbox name="villageId" options={VILLAGE_OPTIONS} defaultValue={params.villageId} placeholder="Toutes les zones" />
                    </div>
                    <div className="flex w-full lg:w-auto gap-2">
                        <Link
                            href="/admin"
                            className="flex h-11 items-center justify-center rounded-xl border border-gray-200 dark:border-slate-700 px-4 text-sm font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors w-full lg:w-auto"
                        >
                            Effacer
                        </Link>
                        <button
                            type="submit"
                            className="flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-bold text-white hover:bg-brand-hover transition-colors shadow-sm w-full lg:w-auto"
                        >
                            Filtrer
                        </button>
                    </div>
                </form>

                {/* TABLE */}
                <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-gray-200 dark:ring-slate-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-700 text-left text-sm">
                            <thead>
                                <tr className="bg-gray-50/60 dark:bg-slate-700/50">
                                    <th className="px-5 py-4 font-bold text-gray-700 dark:text-slate-300 whitespace-nowrap">Client</th>
                                    <th className="px-5 py-4 font-bold text-gray-700 dark:text-slate-300 whitespace-nowrap">Zone</th>
                                    <SortHeader field="provider"  label="Opérateur" params={params} />
                                    <SortHeader field="amount"    label="Montant"   params={params} />
                                    <SortHeader field="status"    label="Statut"    params={params} />
                                    <SortHeader field="createdAt" label="Date"      params={params} />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {payments.map(payment => (
                                    <tr key={payment.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="whitespace-nowrap px-5 py-4">
                                            <p className="font-bold text-gray-900 dark:text-slate-100">
                                                {payment.client.firstName} {payment.client.lastName}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{payment.client.phone ?? ''}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="font-semibold text-gray-700 dark:text-slate-300">{payment.client.village.titre ?? '—'}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="font-medium text-gray-600 dark:text-slate-400">{PROVIDER_LABELS[payment.provider]}</span>
                                        </td>
                                        <td className="px-5 py-4 font-extrabold text-gray-900 dark:text-slate-100 whitespace-nowrap">
                                            {payment.amount.toLocaleString('fr-FR')} <span className="text-xs font-bold text-gray-500 dark:text-slate-400">FCFA</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusUpdater paymentId={payment.id} currentStatus={payment.status} />
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 dark:text-slate-400 whitespace-nowrap text-xs">
                                            {new Intl.DateTimeFormat('fr-SN', {
                                                dateStyle: 'medium',
                                                timeStyle: 'short',
                                            }).format(payment.createdAt)}
                                        </td>
                                    </tr>
                                ))}

                                {payments.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-16">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-700">
                                                    <svg className="h-6 w-6 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                    </svg>
                                                </div>
                                                <p className="font-bold text-gray-900 dark:text-slate-100">Aucune transaction trouvée</p>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">Modifiez vos critères de filtre.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    {totalPages > 1 && (
                        <div className="border-t border-gray-100 dark:border-slate-700 px-5 py-3 flex items-center justify-between gap-4">
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                                Page <span className="font-bold text-gray-700 dark:text-slate-300">{page}</span> sur <span className="font-bold text-gray-700 dark:text-slate-300">{totalPages}</span>
                                {' '}·{' '}
                                <span className="font-bold text-gray-700 dark:text-slate-300">{totalCount}</span> résultat{totalCount !== 1 ? 's' : ''}
                            </p>
                            <div className="flex items-center gap-2">
                                {page > 1 ? (
                                    <Link
                                        href={pageLink(page - 1)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                        aria-label="Page précédente"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 dark:border-slate-800 text-gray-300 dark:text-slate-600">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </span>
                                )}
                                {page < totalPages ? (
                                    <Link
                                        href={pageLink(page + 1)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                        aria-label="Page suivante"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                ) : (
                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 dark:border-slate-800 text-gray-300 dark:text-slate-600">
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

function SortHeader({
    field,
    label,
    params,
}: {
    field:  string;
    label:  string;
    params: { [key: string]: string | undefined };
}) {
    const q         = new URLSearchParams(params as Record<string, string>);
    const isActive  = params.sortBy === field || (!params.sortBy && field === 'createdAt');
    const curOrder  = params.sortOrder ?? 'desc';
    const nextOrder = isActive && curOrder === 'desc' ? 'asc' : 'desc';
    q.set('sortBy',    field);
    q.set('sortOrder', nextOrder);
    q.delete('page');
    const href = `/admin?${q.toString()}`;

    return (
        <th className="px-5 py-4 font-bold text-gray-700 dark:text-slate-300 group select-none whitespace-nowrap">
            <Link href={href} className="flex items-center gap-1.5 hover:text-brand transition-colors">
                {label}
                <span className={`flex flex-col ${isActive ? 'text-brand' : 'text-gray-300 dark:text-slate-600 group-hover:text-gray-400 dark:group-hover:text-slate-500'}`}>
                    <svg className={`h-2.5 w-2.5 -mb-px ${isActive && curOrder === 'asc' ? 'opacity-100' : 'opacity-30'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
                    </svg>
                    <svg className={`h-2.5 w-2.5 ${isActive && curOrder === 'desc' ? 'opacity-100' : 'opacity-30'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </span>
            </Link>
        </th>
    );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: boolean }) {
    return (
        <div className="rounded-2xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-slate-700">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">{label}</p>
            <p className={`mt-2 text-2xl font-extrabold ${accent ? 'text-brand' : 'text-gray-900 dark:text-slate-100'}`}>
                {value}
            </p>
        </div>
    );
}
