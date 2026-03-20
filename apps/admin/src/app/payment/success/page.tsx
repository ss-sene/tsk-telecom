// src/app/payment/success/page.tsx
import Link from 'next/link';
import { prisma } from '@/core/db/prisma';

export const dynamic = 'force-dynamic';

interface Props {
    searchParams: Promise<{ ref?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: Props) {
    const { ref } = await searchParams;

    const payment = ref
        ? await prisma.payment.findUnique({
              where:   { internalRef: ref },
              include: { client: { include: { village: true } } },
          })
        : null;

    const isSuccess = payment?.status === 'SUCCESS';
    const isPending = payment?.status === 'PENDING';
    const isFailed  = payment?.status === 'FAILED';

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-sm ring-1 ring-gray-200 p-8 text-center">

                {isSuccess && (
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}
                {isPending && (
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
                        <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                )}
                {(isFailed || !payment) && (
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                )}

                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                    {isSuccess && 'Paiement confirmé'}
                    {isPending && 'Paiement en cours'}
                    {isFailed  && 'Paiement échoué'}
                    {!payment  && 'Paiement introuvable'}
                </h1>

                <p className="text-gray-500 mb-6 text-sm">
                    {isSuccess && 'Votre abonnement TDK Telecom est activé. Bienvenue !'}
                    {isPending && 'Votre paiement est en cours de traitement. Vous recevrez une confirmation par SMS.'}
                    {isFailed  && 'Une erreur est survenue. Aucun montant n\'a été débité.'}
                    {!payment  && 'Impossible de retrouver ce paiement.'}
                </p>

                {payment && (
                    <div className="rounded-2xl bg-gray-50 p-4 text-left text-sm mb-6 space-y-2.5">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Référence</span>
                            <span className="font-mono font-bold text-gray-900 text-xs bg-gray-200 px-2 py-0.5 rounded">
                                {payment.internalRef}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Montant</span>
                            <span className="font-extrabold text-gray-900">
                                {payment.amount.toLocaleString('fr-FR')} FCFA
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Opérateur</span>
                            <span className="font-bold text-gray-900">
                                {payment.provider === 'WAVE' ? 'Wave' : 'Orange Money'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Client</span>
                            <span className="font-bold text-gray-900">
                                {payment.client.firstName ?? ''} {payment.client.lastName ?? ''}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Zone</span>
                            <span className="font-bold text-gray-900">
                                {payment.client.village.titre}
                            </span>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {(isFailed || !payment) && (
                        <Link
                            href="/checkout"
                            className="flex h-11 items-center justify-center rounded-xl bg-[#1A3C9F] px-6 text-sm font-bold text-white w-full"
                        >
                            Réessayer
                        </Link>
                    )}
                    <Link
                        href="/"
                        className="flex h-11 items-center justify-center rounded-xl border border-gray-300 px-6 text-sm font-bold text-gray-700 hover:bg-gray-50 w-full"
                    >
                        Retour à l&apos;accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}