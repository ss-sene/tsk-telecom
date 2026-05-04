import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicHeader } from '@/app/PublicHeader';
import { PublicFooter } from '@/app/PublicFooter';
import { COMPANY } from '@/lib/company';

export const metadata: Metadata = {
    title:       'Politique de confidentialité',
    description: 'Politique de protection des données personnelles de TOUBA DAROU KHOUDOSS TELECOM.',
    alternates:  { canonical: '/politique-de-confidentialite' },
    robots:      { index: false, follow: false },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="mb-10">
            <h2 className="text-lg font-extrabold text-text-base mb-4 pb-2 border-b border-border-default">
                {title}
            </h2>
            <div className="space-y-3 text-sm text-text-secondary leading-relaxed">
                {children}
            </div>
        </section>
    );
}

export default function PolitiqueConfidentialitePage() {
    return (
        <div className="min-h-screen bg-surface-page text-text-base">
            <PublicHeader />

            <main className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
                <div className="mb-12">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Légal</p>
                    <h1 className="text-3xl font-black tracking-[-0.03em] text-text-base sm:text-4xl mb-4">
                        Politique de confidentialité
                    </h1>
                    <p className="text-sm text-text-muted">
                        Conformément à la loi sénégalaise n° 2008-12 du 25 janvier 2008.
                        Dernière mise à jour : avril 2026.
                    </p>
                </div>

                <Section title="1. Responsable du traitement">
                    <p>
                        Le responsable du traitement des données à caractère personnel est :
                    </p>
                    <p><span className="font-semibold text-text-secondary">TOUBA DAROU KHOUDOSS TELECOM</span></p>
                    <p>Touba Darou Khoudoss, Sénégal</p>
                    <p>
                        Email :{' '}
                        <a href={`mailto:${COMPANY.email}`} className="text-brand hover:underline">{COMPANY.email}</a>
                    </p>
                    <p>
                        Téléphone :{' '}
                        <a href={`tel:${COMPANY.phone}`} className="text-brand hover:underline">{COMPANY.phoneDisplay}</a>
                    </p>
                </Section>

                <Section title="2. Données collectées">
                    <p>Lors de la souscription à nos services, nous collectons :</p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>Nom et prénom</li>
                        <li>Numéro de téléphone mobile</li>
                        <li>Adresse email (optionnelle)</li>
                        <li>Village ou localité</li>
                        <li>Informations de paiement (traitées exclusivement par Wave ou Orange Money — nous ne stockons aucune donnée bancaire)</li>
                    </ul>
                </Section>

                <Section title="3. Finalités du traitement">
                    <p>Vos données sont utilisées exclusivement pour :</p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>La création et la gestion de votre abonnement Internet</li>
                        <li>Le traitement et le suivi de vos paiements</li>
                        <li>La communication relative à votre service (pannes, maintenance, renouvellement)</li>
                        <li>Le respect de nos obligations légales</li>
                    </ul>
                    <p>Vos données ne sont jamais vendues ni transmises à des tiers à des fins commerciales.</p>
                </Section>

                <Section title="4. Base légale">
                    <p>
                        Le traitement est fondé sur l&apos;exécution du contrat d&apos;abonnement que vous souscrivez avec
                        TOUBA DAROU KHOUDOSS TELECOM, ainsi que sur le respect de nos obligations légales.
                    </p>
                </Section>

                <Section title="5. Durée de conservation">
                    <p>
                        Vos données sont conservées pendant la durée de votre abonnement et jusqu&apos;à 3 ans après
                        la résiliation, conformément aux obligations légales comptables et fiscales au Sénégal.
                    </p>
                </Section>

                <Section title="6. Vos droits">
                    <p>
                        Conformément à la loi sénégalaise n° 2008-12, vous disposez des droits suivants :
                    </p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        <li><span className="text-text-secondary font-medium">Droit d&apos;accès</span> : obtenir une copie de vos données</li>
                        <li><span className="text-text-secondary font-medium">Droit de rectification</span> : corriger vos données inexactes</li>
                        <li><span className="text-text-secondary font-medium">Droit à l&apos;effacement</span> : demander la suppression de vos données</li>
                        <li><span className="text-text-secondary font-medium">Droit d&apos;opposition</span> : vous opposer à certains traitements</li>
                    </ul>
                    <p>
                        Pour exercer ces droits, contactez-nous :{' '}
                        <a href={`mailto:${COMPANY.email}`} className="text-brand hover:underline">{COMPANY.email}</a>
                    </p>
                </Section>

                <Section title="7. Sécurité">
                    <p>
                        Nous mettons en œuvre des mesures techniques et organisationnelles adaptées pour protéger
                        vos données contre tout accès non autorisé, modification, divulgation ou destruction.
                        Les communications sont chiffrées en HTTPS/TLS.
                    </p>
                </Section>

                <Section title="8. Cookies">
                    <p>
                        Ce site utilise uniquement des cookies techniques strictement nécessaires
                        (session d&apos;authentification pour l&apos;espace administrateur).
                        Aucun cookie de suivi, publicitaire ou de profilage n&apos;est déposé.
                    </p>
                </Section>

                <div className="mt-12 pt-8 border-t border-border-default flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-text-base transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour à l&apos;accueil
                    </Link>
                    <Link href="/mentions-legales" className="text-sm text-text-faint hover:text-text-secondary transition-colors">
                        Mentions légales →
                    </Link>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
