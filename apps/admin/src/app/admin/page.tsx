// apps/admin/src/app/admin/page.tsx
import { prisma } from '@/core/db/prisma';
import { PaymentStatus, PaymentProvider, Prisma } from '@/generated/prisma/client';
import Link from 'next/link';
import { CustomListbox } from '@/components/ui/CustomListbox';
import { StatusUpdater } from './components/StatusUpdater';

// --- DICTIONNAIRES DE TRADUCTION ---
const PROVIDER_LABELS: Record<PaymentProvider, string> = {
    WAVE: 'Wave',
    ORANGE_MONEY: 'Orange Money',
};

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

// --- DATA FETCHING ---
async function getDashboardData(params: { [key: string]: string | undefined }) {
    const where: Prisma.PaymentWhereInput = {};

    if (params.status) where.status = params.status as PaymentStatus;
    if (params.provider) where.provider = params.provider as PaymentProvider;

    if (params.villageId) {
        where.client = {
            villageId: params.villageId
        };
    }

    if (params.search && params.search.trim() !== '') {
        const searchTerm = params.search.trim();
        where.client = {
            ...where.client,
            OR: [
                { firstName: { contains: searchTerm, mode: 'insensitive' } },
                { lastName: { contains: searchTerm, mode: 'insensitive' } },
                { phone: { contains: searchTerm } }
            ]
        };
    }

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
                client: { 
                    include: { village: true }
                }
            }
        }),
        prisma.payment.groupBy({
            by: ['status'],
            where: {
                ...(params.status && { status: params.status as PaymentStatus }),
                ...(params.provider && { provider: params.provider as PaymentProvider }),
            },
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

export default async function AdminDashboard(props: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const params = await props.searchParams;

    const [{ recentPayments, stats }, allVillages] = await Promise.all([
        getDashboardData(params),
        prisma.village.findMany({ orderBy: { titre: 'asc' } })
    ]);

    const VILLAGE_OPTIONS = allVillages.map(v => ({
        value: v.id,
        label: v.titre
    }));

    const conversionRate = stats.totalCount > 0
        ? Math.round((stats.successCount / stats.totalCount) * 100)
        : 0;

    const renderSortableHeader = (field: string, label: string) => {
        const query = new URLSearchParams(params as Record<string, string>);
        const isActive = params.sortBy === field || (!params.sortBy && field === 'createdAt');
        const currentOrder = params.sortOrder || 'desc';
        const nextOrder = isActive && currentOrder === 'desc' ? 'asc' : 'desc';
        query.set('sortBy', field);
        query.set('sortOrder', nextOrder);

        return (
            <th className="px-6 py-5 font-bold text-gray-900 group select-none">
                <Link href={`/admin?${query.toString()}`} className="flex items-center gap-2 hover:text-[#1A3C9F] transition-colors">
                    {label}
                    <span className={`flex flex-col ${isActive ? 'text-[#1A3C9F]' : 'text-gray-300 group-hover:text-gray-400'}`}>
                        <svg className={`h-2.5 w-2.5 -mb-[2px] ${isActive && currentOrder === 'asc' ? 'opacity-100' : 'opacity-40'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" /></svg>
                        <svg className={`h-2.5 w-2.5 ${isActive && currentOrder === 'desc' ? 'opacity-100' : 'opacity-40'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </span>
                </Link>
            </th>
        );
    };

    // --- CORRECTION CRITIQUE ---
    // Création d'une clé unique basée sur l'état de l'URL.
    // Si l'URL change (ex: quand on clique sur "Effacer" et qu'on revient sur "/admin"),
    // la clé change, forçant React à détruire et recréer complètement le formulaire et ses enfants.
    const formKey = new URLSearchParams(params as Record<string, string>).toString();

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="mx-auto max-w-7xl space-y-8">
                
                {/* STATS CARDS */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200 text-center">
                        <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Revenu Validé</p>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900">{stats.revenue.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200 text-center">
                        <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Transactions Réussies</p>
                        <p className="mt-2 text-3xl font-extrabold text-gray-900">{stats.successCount}</p>
                    </div>
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200 text-center">
                        <p className="text-sm font-bold uppercase tracking-wider text-gray-500">Taux de Conversion</p>
                        <p className="mt-2 text-3xl font-extrabold text-[#1A3C9F]">{conversionRate}%</p>
                    </div>
                </div>

                {/* FILTERS FORM */}
                {/* Injection de la "key" dynamique */}
                <form key={formKey} action="/admin" method="GET" className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-200 flex flex-col lg:flex-row items-end gap-4">
                    
                    <div className="w-full lg:flex-2">
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500">Recherche</label>
                        <input
                            type="search"
                            name="search"
                            defaultValue={params.search}
                            placeholder="Nom, téléphone..."
                            className="block h-11 w-full rounded-xl border-0 px-4 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-[#1A3C9F]"
                        />
                    </div>

                    <div className="w-full lg:flex-1">
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500">Statut</label>
                        <CustomListbox name="status" options={STATUS_OPTIONS} defaultValue={params.status} placeholder="Tous les statuts" />
                    </div>

                    <div className="w-full lg:flex-1">
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500">Opérateur</label>
                        <CustomListbox name="provider" options={PROVIDER_OPTIONS} defaultValue={params.provider} placeholder="Tous" />
                    </div>

                    <div className="w-full lg:flex-1">
                        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500">Village / Zone</label>
                        <CustomListbox name="villageId" options={VILLAGE_OPTIONS} defaultValue={params.villageId} placeholder="Toutes les zones" />
                    </div>

                    <div className="flex w-full lg:w-auto gap-2">
                        <Link href="/admin" className="flex h-11 items-center justify-center rounded-xl border border-gray-300 px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 w-full lg:w-auto">Effacer</Link>
                        <button type="submit" className="flex h-11 items-center justify-center rounded-xl bg-[#1A3C9F] px-6 text-sm font-bold text-white shadow-md w-full lg:w-auto">Filtrer</button>
                    </div>
                </form>

                {/* TABLE */}
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-5 font-bold text-gray-900">Prénom</th>
                                    <th className="px-6 py-5 font-bold text-gray-900">Nom</th>
                                    <th className="px-6 py-5 font-bold text-gray-900">Village</th>
                                    {renderSortableHeader('provider', 'Opérateur')}
                                    {renderSortableHeader('amount', 'Montant')}
                                    {renderSortableHeader('status', 'Statut')}
                                    {renderSortableHeader('createdAt', 'Date')}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-blue-50/50 transition-colors">
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="font-bold text-gray-900">{payment.client.firstName}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="font-bold text-gray-900">{payment.client.lastName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-gray-700">{payment.client.village.titre}</span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-600">
                                            {PROVIDER_LABELS[payment.provider]}
                                        </td>
                                        <td className="px-6 py-4 font-black text-gray-900">
                                            {payment.amount.toLocaleString('fr-FR')} FCFA
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusUpdater paymentId={payment.id} currentStatus={payment.status} />
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Intl.DateTimeFormat('fr-SN', { dateStyle: 'medium', timeStyle: 'short' }).format(payment.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                                {recentPayments.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-16">
                                            <div className="flex flex-col items-center justify-center text-center text-gray-500 w-full">
                                                <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                                <span className="font-semibold text-lg text-gray-900">Aucune transaction trouvée</span>
                                                <span className="text-sm mt-1">Modifiez vos critères de recherche ou de filtrage.</span>
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