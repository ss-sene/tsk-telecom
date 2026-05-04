// src/app/payment/success/page.tsx
// force-dynamic : statut mis à jour en temps réel via router.refresh() (PendingPoller)
import type { Metadata } from 'next';
import Link              from 'next/link';

export const metadata: Metadata = {
    robots: { index: false, follow: false },
};
import { prisma } from '@/core/db/prisma';
import { PendingPoller } from './PendingPoller';

export const dynamic = 'force-dynamic';

interface Props {
    searchParams: Promise<{ ref?: string }>;
}

const PROVIDER_LABELS: Record<string, string> = {
    WAVE:         'Wave',
    ORANGE_MONEY: 'Orange Money',
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
    const { ref } = await searchParams;

    const payment = ref
        ? await prisma.payment.findUnique({
              where:  { internalRef: ref },
              select: {
                  internalRef: true,
                  status:      true,
                  amount:      true,
                  provider:    true,
                  client: {
                      select: {
                          firstName: true,
                          lastName:  true,
                          village:   { select: { titre: true } },
                      },
                  },
              },
          })
        : null;

    const status    = payment?.status ?? null;
    const isSuccess = status === 'SUCCESS';
    const isPending = status === 'PENDING';
    const isFailed  = status === 'FAILED';

    return (
        <div className="min-h-screen bg-surface-page flex items-center justify-center p-4">

            {isPending && payment && (
                <PendingPoller internalRef={payment.internalRef} />
            )}

            <div className="max-w-md w-full bg-surface-card rounded-2xl shadow-[var(--shadow-card)] ring-1 ring-border-default p-8 text-center">

                {isSuccess && (
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10" style={{ animation: 'successIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
                        <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}

                {isPending && (
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/15">
                        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-yellow-400 border-t-transparent" aria-label="Chargement" />
                    </div>
                )}

                {(isFailed || !payment) && (
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15">
                        <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                )}

                <h1 className="text-2xl font-extrabold text-text-base mb-2">
                    {isSuccess && 'Paiement confirmé !'}
                    {isPending && 'En attente de confirmation…'}
                    {isFailed  && 'Paiement échoué'}
                    {!payment  && 'Référence introuvable'}
                </h1>

                <p className="text-sm leading-relaxed text-text-muted mb-6">
                    {isSuccess && 'Votre abonnement TDK Telecom est activé. Bienvenue !'}
                    {isPending && (
                        <>
                            Votre paiement a bien été soumis.{' '}
                            Nous attendons la confirmation de{' '}
                            {payment ? PROVIDER_LABELS[payment.provider] ?? payment.provider : "l'opérateur"}.
                            <br />
                            <span className="font-semibold text-text-secondary">Cette page se met à jour automatiquement.</span>
                        </>
                    )}
                    {isFailed  && "Une erreur est survenue lors du paiement. Aucun montant n'a été débité."}
                    {!payment  && 'Cette référence de paiement est introuvable. Vérifiez le lien ou contactez le support.'}
                </p>

                {payment && (
                    <div className="rounded-2xl bg-surface-section p-4 text-left text-sm mb-6 space-y-2.5 ring-1 ring-border-default">
                        <Row label="Référence">
                            <span className="font-mono text-xs font-bold text-text-base bg-surface-raised px-2 py-0.5 rounded">
                                {payment.internalRef}
                            </span>
                        </Row>
                        <Row label="Montant">
                            <span className="font-extrabold text-text-base">{payment.amount.toLocaleString('fr-FR')} FCFA</span>
                        </Row>
                        <Row label="Client">
                            <span className="font-bold text-text-base">
                                {payment.client.firstName ?? ''} {payment.client.lastName ?? ''}
                            </span>
                        </Row>
                        <Row label="Zone">
                            <span className="font-bold text-text-base">{payment.client.village.titre}</span>
                        </Row>
                        <Row label="Opérateur">
                            <span className="font-bold text-text-base">{PROVIDER_LABELS[payment.provider] ?? payment.provider}</span>
                        </Row>
                        <Row label="Statut">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                isSuccess ? 'bg-success/10 text-success' :
                                isPending ? 'bg-yellow-500/15 text-yellow-300' :
                                'bg-red-500/15 text-red-400'
                            }`}>
                                {isSuccess ? 'Confirmé' : isPending ? 'En attente' : 'Échoué'}
                            </span>
                        </Row>
                    </div>
                )}

                <div className="space-y-3">
                    {(isFailed || !payment) && (
                        <Link
                            href="/checkout"
                            className="flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-bold text-[#121A26] hover:bg-brand-hover transition-colors w-full"
                        >
                            Réessayer
                        </Link>
                    )}
                    <Link
                        href="/"
                        className="flex h-11 items-center justify-center rounded-xl border border-border-default px-6 text-sm font-bold text-text-secondary hover:bg-surface-section transition-colors w-full"
                    >
                        Retour à l&apos;accueil
                    </Link>
                </div>
            </div>
        </div>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-text-muted shrink-0">{label}</span>
            <span className="text-right">{children}</span>
        </div>
    );
}
