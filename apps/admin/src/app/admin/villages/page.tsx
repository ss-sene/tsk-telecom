// admin/villages/page.tsx
import { prisma }         from '@/core/db/prisma';
import { VillageRow }     from './components/VillageRow';
import { AddVillageForm } from './components/AddVillageForm';

export default async function VillagesPage() {
    const villages = await prisma.village.findMany({
        orderBy: { titre: 'asc' },
        include: {
            _count: { select: { clients: true } },
            clients: {
                select: {
                    _count: { select: { payments: true } },
                },
            },
        },
    });

    const rows = villages.map(v => ({
        id:           v.id,
        titre:        v.titre ?? '',
        clientCount:  v._count.clients,
        paymentCount: v.clients.reduce((sum, c) => sum + c._count.payments, 0),
    }));

    return (
        <div className="min-h-screen bg-card dark:bg-slate-900 px-4 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto max-w-7xl space-y-6">

                {/* PAGE TITLE */}
                <div>
                    <h1 className="text-xl font-extrabold text-gray-900 dark:text-slate-100">
                        Villages / Zones
                    </h1>
                    <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
                        {villages.length} zone{villages.length !== 1 ? 's' : ''} enregistrée{villages.length !== 1 ? 's' : ''}
                    </p>
                </div>

                {/* ADD FORM */}
                <AddVillageForm />

                {/* TABLE */}
                <div className="overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-sm ring-1 ring-gray-200 dark:ring-slate-700">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-700 text-left text-sm">
                            <thead>
                                <tr className="bg-gray-50/60 dark:bg-slate-700/50">
                                    <th className="px-5 py-4 font-bold text-gray-700 dark:text-slate-300">Nom</th>
                                    <th className="px-5 py-4 font-bold text-gray-700 dark:text-slate-300 whitespace-nowrap">Clients</th>
                                    <th className="px-5 py-4 font-bold text-gray-700 dark:text-slate-300 whitespace-nowrap">Transactions</th>
                                    <th className="px-5 py-4 font-bold text-gray-700 dark:text-slate-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                                {rows.map(row => (
                                    <VillageRow key={row.id} {...row} />
                                ))}

                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-700">
                                                    <svg className="h-6 w-6 text-gray-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <p className="font-bold text-gray-900 dark:text-slate-100">Aucun village enregistré</p>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                                                    Ajoutez votre premier village ci-dessus.
                                                </p>
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
