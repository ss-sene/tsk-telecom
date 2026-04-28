// admin/clients/page.tsx
import { prisma }       from '@/core/db/prisma';
import { Prisma, PaymentStatus } from '@/generated/prisma/client';
import Link             from 'next/link';
import { CustomListbox } from '@/components/ui/CustomListbox';

const PAGE_SIZE = 25;

async function getClientsData(params: { [key: string]: string | undefined }) {
    const where: Prisma.ClientWhereInput = {};

    if (params.villageId) where.villageId = params.villageId;
    if (params.search?.trim()) {
        const s = params.search.trim();
        where.OR = [
            { firstName: { contains: s, mode: 'insensitive' } },
            { lastName:  { contains: s, mode: 'insensitive' } },
            { phone:     { contains: s } },
        ];
    }

    const page = Math.max(1, parseInt(params.page ?? '1', 10));
    const skip = (page - 1) * PAGE_SIZE;

    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [clients, totalCount, totalClients, newThisMonth, villageCount] = await Promise.all([
        prisma.client.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: PAGE_SIZE,
            include: {
                village: true,
                payments: {
                    select: { amount: true, status: true, createdAt: true },
                    orderBy: { createdAt: 'desc' },
                },
            },
        }),
        prisma.client.count({ where }),
        prisma.client.count(),
        prisma.client.count({ where: { createdAt: { gte: monthStart } } }),
        prisma.village.count(),
    ]);

    return { clients, totalCount, page, totalClients, newThisMonth, villageCount };
}

export default async function ClientsPage(
    props: { searchParams: Promise<{ [key: string]: string | undefined }> },
) {
    const params = await props.searchParams;

    const [data, allVillages] = await Promise.all([
        getClientsData(params),
        prisma.village.findMany({ orderBy: { titre: 'asc' } }),
    ]);

    const { clients, totalCount, page, totalClients, newThisMonth, villageCount } = data;

    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const hasFilter  = ['villageId', 'search'].some(k => params[k]);

    const VILLAGE_OPTIONS = allVillages.map(v => ({ value: v.id, label: v.titre ?? 'Sans nom' }));
    const formKey = new URLSearchParams(params as Record<string, string>).toString();

    const pageLink = (p: number) => {
        const q = new URLSearchParams(params as Record<string, string>);
        q.set('page', String(p));
        return `/admin/clients?${q.toString()}`;
    };

    return (
        <div className="min-h-screen bg-card dark:bg-slate-900 px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* PAGE TITLE */}
                <div>
                    <h1 className="text-xl font-extrabold text-gray-900 dark:text-slate-100">Clients</h1>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
                        {totalCount} résultat{totalCount !== 1 ? 's' : ''}{hasFilter ? ' avec les filtres actifs' : ' au total'}
                    </p>
                </div>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard label="Total clients"     value={String(totalClients)} accent={false} />
                    <StatCard label="Nouveaux ce mois"  value={String(newThisMonth)} accent={true}  />
                    <StatCard label="Zones actives"     value={String(villageCount)} accent={false} />
                </div>

                {/* FILTERS */}
                <form
                    key={formKey}
                    action="/admin/clients"
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
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                            Zone
                        </label>
                        <CustomListbox
                            name="villageId"
                            options={VILLAGE_OPTIONS}
                            defaultValue={params.villageId}
                            placeholder="Toutes les zones"
                        />
                    </div>
                    <div className="flex w-full lg:w-auto gap-2">
                        <Link
                            href="/admin/clients"
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
                                    <th className="px-5 py-4 font-bold text-gray-700 dark:text-slate-300 whitespace-nowrap">Transactions</th>
                                    <th className="px-5 py-4 font-bold text-gray-700 dark:text-slate-300 whitespace-nowrap">Total payé</th>
                                    <th className="px-5 py-4 font-bold text-gray-700 dark:text-slate-300 whitespace-nowrap">Dernière activité</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {clients.map(client => {
                                    const successPayments = client.payments.filter(
                                        p => p.status === PaymentStatus.SUCCESS,
                                    );
                                    const totalPaid   = successPayments.reduce((s, p) => s + p.amount, 0);
                                    const lastPayment = client.payments[0];

                                    return (
                                        <tr key={client.id} className="hover:bg-blue-50/40 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <p className="font-bold text-gray-900 dark:text-slate-100">
                                                    {client.firstName} {client.lastName}
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{client.phone}</p>
                                                {client.email && (
                                                    <p className="text-xs text-gray-400 dark:text-slate-500">{client.email}</p>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="font-semibold text-gray-700 dark:text-slate-300">
                                                    {client.village.titre ?? '—'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <span className="font-extrabold text-gray-900 dark:text-slate-100">
                                                        {successPayments.length}
                                                    </span>
                                                    <span className="text-xs text-gray-400 dark:text-slate-500">
                                                        /{client.payments.length}
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 font-extrabold text-gray-900 dark:text-slate-100 whitespace-nowrap">
                                                {totalPaid > 0 ? (
                                                    <>
                                                        {totalPaid.toLocaleString('fr-FR')}
                                                        {' '}<span className="text-xs font-bold text-gray-500 dark:text-slate-400">FCFA</span>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-300 dark:text-slate-600 font-normal">—</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4 text-gray-500 dark:text-slate-400 whitespace-nowrap text-xs">
                                                {lastPayment
                                                    ? new Intl.DateTimeFormat('fr-SN', {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short',
                                                    }).format(lastPayment.createdAt)
                                                    : '—'}
                                            </td>
                                        </tr>
                                    );
                                })}

                                {clients.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-700">
                                                    <svg className="h-6 w-6 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                                                    </svg>
                                                </div>
                                                <p className="font-bold text-gray-900 dark:text-slate-100">Aucun client trouvé</p>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                                                    Modifiez vos critères de filtre.
                                                </p>
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
                                Page{' '}
                                <span className="font-bold text-gray-700 dark:text-slate-300">{page}</span>
                                {' '}sur{' '}
                                <span className="font-bold text-gray-700 dark:text-slate-300">{totalPages}</span>
                                {' '}·{' '}
                                <span className="font-bold text-gray-700 dark:text-slate-300">{totalCount}</span>
                                {' '}résultat{totalCount !== 1 ? 's' : ''}
                            </p>
                            <div className="flex items-center gap-2">
                                {page > 1 ? (
                                    <Link
                                        href={pageLink(page - 1)}
                                        aria-label="Page précédente"
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
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
                                        aria-label="Page suivante"
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
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
