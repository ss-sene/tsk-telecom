// apps/admin/src/app/admin/page.tsx
import { prisma } from '@/core/db/prisma';
import { PaymentStatus, PaymentProvider, Prisma } from '@prisma/client';
import Link from 'next/link';
import { CustomListbox } from '@/components/ui/CustomListbox';

// --- DICTIONNAIRES DE TRADUCTION (O(1) Lookups) ---
const STATUS_LABELS: Record<PaymentStatus, string> = {
    SUCCESS: 'Confirmé',
    PENDING: 'En attente',
    FAILED: 'Échoué',
    REFUNDED: 'Remboursé',
};

const PROVIDER_LABELS: Record<PaymentProvider, string> = {
    WAVE: 'Wave',
    ORANGE_MONEY: 'Orange Money',
};

const PLANS: Record<string, number> = {
    '10000': 10000,
    '12000': 12000,
};

// --- TRANSFORMATION EN OPTIONS POUR LE LISTBOX ---
const STATUS_OPTIONS = [
    { value: 'SUCCESS', label: 'Confirmé' },
    { value: 'PENDING', label: 'En attente' },
    { value: 'FAILED', label: 'Échoué' },
    { value: 'REFUNDED', label: 'Remboursé' },
];

const PROVIDER_OPTIONS = [
    { value: 'WAVE', label: 'Wave' },
    { value: 'ORANGE_MONEY', label: 'Orange Money' },
];

const PLAN_OPTIONS = [
    { value: '10000', label: 'Pack Standard (10k)' },
    { value: '12000', label: 'Pack Premium (12k)' },
];

// --- DATA FETCHING ---
async function getDashboardData(params: { [key: string]: string | undefined }) {
    const where: Prisma.PaymentWhereInput = {};

    if (params.status) where.status = params.status as PaymentStatus;
    if (params.provider) where.provider = params.provider as PaymentProvider;
    if (params.plan && PLANS[params.plan]) {
        where.amount = PLANS[params.plan];
    }

    // Sécurisation stricte (Whitelist) étendue aux nouveaux champs triables
    const allowedSortFields = ['createdAt', 'amount', 'status', 'provider'];
    const sortBy = allowedSortFields.includes(params.sortBy || '') ? params.sortBy! : 'createdAt';
    const sortOrder = params.sortOrder === 'asc' ? 'asc' : 'desc';

    const orderBy: Prisma.PaymentOrderByWithRelationInput = {
        [sortBy]: sortOrder,
    };

    const [recentPayments, aggregations] = await Promise.all([
        prisma.payment.findMany({
            where,
            orderBy,
            take: 50,
            include: {
                client: { select: { firstName: true, lastName: true, phone: true } }
            }
        }),
        prisma.payment.groupBy({
            by: ['status'],
            _sum: { amount: true },
            _count: { id: true }
        })
    ]);

    const stats = aggregations.reduce(
        (acc, curr) => {
            if (curr.status === PaymentStatus.SUCCESS) {
                acc.revenue += curr._sum.amount || 0;
                acc.successCount += curr._count.id;
            }
            acc.totalCount += curr._count.id;
            return acc;
        },
        { revenue: 0, successCount: 0, totalCount: 0 }
    );

    return { recentPayments, stats };
}

// --- COMPOSANT UI (Server Component) ---
export default async function AdminDashboard(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const params = await props.searchParams;
    const { recentPayments, stats } = await getDashboardData(params);

    const conversionRate = stats.totalCount > 0
        ? Math.round((stats.successCount / stats.totalCount) * 100)
        : 0;

    // --- HELPER : Générateur de liens de Tri pour les en-têtes ---
    const renderSortableHeader = (field: string, label: string) => {
        // 1. On clone les paramètres actuels pour ne pas perdre les filtres
        const query = new URLSearchParams(params as Record<string, string>);

        // 2. Détermination de l'état actuel
        const isActive = params.sortBy === field || (!params.sortBy && field === 'createdAt');
        const currentOrder = params.sortOrder || 'desc';
        const nextOrder = isActive && currentOrder === 'desc' ? 'asc' : 'desc';

        // 3. Mise à jour de l'URL cible
        query.set('sortBy', field);
        query.set('sortOrder', nextOrder);

        return (
            <th className="px-6 py-5 font-bold text-gray-900 group select-none">
                <Link href={`/admin?${query.toString()}`} className="flex items-center gap-2 hover:text-[#1A3C9F] transition-colors">
                    {label}
                    {/* Indicateur visuel du tri (Flèches empilées) */}
                    <span className={`flex flex-col ${isActive ? 'text-[#1A3C9F]' : 'text-gray-300 group-hover:text-gray-400'}`}>
                        <svg className={`h-2.5 w-2.5 -mb-[2px] ${isActive && currentOrder === 'asc' ? 'opacity-100' : 'opacity-40'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        <svg className={`h-2.5 w-2.5 ${isActive && currentOrder === 'desc' ? 'opacity-100' : 'opacity-40'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </span>
                </Link>
            </th>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="mx-auto max-w-7xl space-y-8">

                {/* HEADER & KPIS */}
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h1>
                        <p className="mt-1 text-sm text-gray-500">Monitoring en temps réel des transactions.</p>
                    </div>
                    {/*<button className="rounded-xl bg-[#1A3C9F] px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#142E7B] transition-colors">
                        Exporter CSV
                    </button>*/}
                </header>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Revenu Validé</p>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900">{stats.revenue.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Transactions Réussies</p>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900">{stats.successCount}</p>
                    </div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                        <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Taux de Conversion</p>
                        <p className="mt-2 text-3xl font-extrabold text-[#1A3C9F]">{conversionRate}%</p>
                    </div>
                </div>

                {/* BARRE DE FILTRES : Modifiée, le Select de Tri a été supprimé puisqu'il est dans la table */}
                <form action="/admin" method="GET" className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 flex flex-col lg:flex-row items-end gap-4">

                    <div className="w-full lg:flex-1">
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500">Statut</label>
                        <CustomListbox name="status" options={STATUS_OPTIONS} defaultValue={params.status} placeholder={"Tous les statuts"}/>
                    </div>

                    <div className="w-full lg:flex-1">
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500">Opérateur</label>
                        <CustomListbox name="provider" options={PROVIDER_OPTIONS} defaultValue={params.provider} placeholder={"Tous les opérateurs"} />
                    </div>

                    <div className="w-full lg:flex-1">
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500">Plan</label>
                        <CustomListbox name="plan" options={PLAN_OPTIONS} defaultValue={params.plan} placeholder={"Tous les plans"} />
                    </div>

                    {/* Bloc d'actions */}
                    <div className="flex w-full lg:w-auto flex-shrink-0 gap-2">
                        <Link href="/admin" className="flex h-11 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm w-full lg:w-auto">
                            Effacer
                        </Link>
                        <button type="submit" className="flex h-11 items-center justify-center rounded-xl bg-[#1A3C9F] px-6 text-sm font-bold text-white hover:bg-[#142E7B] transition-colors shadow-md w-full lg:w-auto">
                            Filtrer
                        </button>
                    </div>

                </form>

                {/* TABLEAU AVEC EN-TÊTES INTERACTIFS */}
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                            <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-5 font-bold text-gray-900">Prénom</th>
                                <th className="px-6 py-5 font-bold text-gray-900">Nom</th>
                                <th className="px-6 py-5 font-bold text-gray-900">Téléphone</th>
                                {renderSortableHeader('provider', 'Opérateur')}
                                {renderSortableHeader('amount', 'Montant')}
                                {renderSortableHeader('status', 'Statut')}
                                {renderSortableHeader('createdAt', 'Date')}
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                            {recentPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-blue-50/50 transition-colors">
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="font-bold text-gray-900">{payment.client.firstName}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="font-bold text-gray-900">{payment.client.lastName}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <div className="font-bold text-gray-900 font-medium">{payment.client.phone}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700">
                                            {PROVIDER_LABELS[payment.provider]}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 font-black text-gray-900">
                                        {payment.amount.toLocaleString('fr-FR')} FCFA
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4">
                                        <StatusBadge status={payment.status} />
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-gray-500 font-medium">
                                        {new Intl.DateTimeFormat('fr-SN', { dateStyle: 'medium', timeStyle: 'short' }).format(payment.createdAt)}
                                    </td>
                                </tr>
                            ))}
                            {recentPayments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16">
                                        <div className="flex flex-col items-center justify-center text-center text-gray-500 w-full">
                                            <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <span className="font-semibold text-lg text-gray-900">Aucune transaction trouvée</span>
                                            <span className="text-sm mt-1">Essayez de modifier vos critères de filtrage.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Micro-composant StatusBadge
function StatusBadge({ status }: { status: PaymentStatus }) {
    const styles: Record<PaymentStatus, string> = {
        SUCCESS: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20',
        PENDING: 'bg-yellow-50 text-yellow-800 ring-1 ring-inset ring-yellow-600/20',
        FAILED: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10',
        REFUNDED: 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-500/10',
    };

    return (
        <span className={`inline-flex items-center rounded-lg px-3 py-1.5 text-xs font-bold ${styles[status]}`}>
            {STATUS_LABELS[status]}
        </span>
    );
}