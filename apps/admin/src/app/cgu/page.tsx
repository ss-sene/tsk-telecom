import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicHeader } from '@/app/PublicHeader';
import { PublicFooter } from '@/app/PublicFooter';
import { COMPANY } from '@/lib/company';

export const metadata: Metadata = {
    title:       "Conditions Générales d'Utilisation",
    description: "Conditions générales d'utilisation des services Internet de TOUBA DAROU KHOUDOSS TELECOM au Sénégal.",
    alternates:  { canonical: '/cgu' },
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

export default function CguPage() {
    return (
        <div className="min-h-screen bg-surface-page text-text-base">
            <PublicHeader />

            <main className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
                <div className="mb-12">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Légal</p>
                    <h1 className="text-3xl font-black tracking-[-0.03em] text-text-base sm:text-4xl mb-4">
                        Conditions Générales d&apos;Utilisation
                    </h1>
                    <p className="text-sm text-text-muted">
                        En vigueur à compter d&apos;avril 2026.
                        Dernière mise à jour : avril 2026.
                    </p>
                </div>

                <Section title="1. Objet">
                    <p>
                        Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation du
                        site internet et des services proposés par TOUBA DAROU KHOUDOSS TELECOM (ci-après « TDK Telecom »),
                        fournisseur d&apos;accès Internet haut débit au Sénégal.
                    </p>
                    <p>
                        Toute utilisation du site ou souscription à un service implique l&apos;acceptation pleine et entière
                        des présentes CGU.
                    </p>
                </Section>

                <Section title="2. Accès aux services">
                    <p>
                        TDK Telecom propose des services d&apos;accès Internet haut débit à destination des particuliers,
                        entreprises et institutions situés dans les zones couvertes au Sénégal.
                    </p>
                    <p>
                        L&apos;accès au service est conditionné à la souscription d&apos;un abonnement et au paiement des frais
                        correspondants via les moyens de paiement acceptés (Wave, Orange Money).
                    </p>
                    <p>
                        TDK Telecom se réserve le droit de refuser une souscription sans justification, notamment en cas
                        de zone non couverte.
                    </p>
                </Section>

                <Section title="3. Obligations de l'abonné">
                    <p>L&apos;abonné s&apos;engage à :</p>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        <li>Fournir des informations exactes et à jour lors de la souscription</li>
                        <li>Utiliser le service dans le respect des lois sénégalaises en vigueur</li>
                        <li>Ne pas utiliser le service à des fins illicites, frauduleuses ou préjudiciables à des tiers</li>
                        <li>Ne pas revendre ou partager commercialement l&apos;accès Internet sans autorisation écrite préalable</li>
                        <li>Signaler tout dysfonctionnement ou incident de sécurité</li>
                    </ul>
                </Section>

                <Section title="4. Tarification et paiement">
                    <p>
                        Les tarifs des offres sont affichés sur le site et peuvent être modifiés par TDK Telecom avec
                        un préavis raisonnable. Les paiements s&apos;effectuent via Wave ou Orange Money. Aucune donnée
                        bancaire n&apos;est stockée par TDK Telecom.
                    </p>
                    <p>
                        Tout paiement effectué est définitif sauf erreur manifeste ou dysfonctionnement technique
                        avéré imputable à TDK Telecom.
                    </p>
                </Section>

                <Section title="5. Disponibilité du service">
                    <p>
                        TDK Telecom s&apos;engage à fournir le service avec le meilleur niveau de disponibilité possible.
                        Des interruptions ponctuelles peuvent survenir pour maintenance, mise à jour ou suite à des
                        événements hors de notre contrôle (cas de force majeure, coupures d&apos;électricité, etc.).
                    </p>
                    <p>
                        TDK Telecom ne saurait être tenu responsable des dommages résultant d&apos;une interruption de service.
                    </p>
                </Section>

                <Section title="6. Résiliation">
                    <p>
                        L&apos;abonné peut résilier son abonnement à tout moment en contactant TDK Telecom par{' '}
                        <a href={`tel:${COMPANY.phone}`} className="text-brand hover:underline">téléphone</a>{' '}
                        ou{' '}
                        <a href={`mailto:${COMPANY.email}`} className="text-brand hover:underline">email</a>.
                        TDK Telecom se réserve le droit de résilier un abonnement en cas de manquement
                        grave aux présentes CGU.
                    </p>
                </Section>

                <Section title="7. Propriété intellectuelle">
                    <p>
                        L&apos;ensemble des éléments du site (textes, logos, graphismes, code) est la propriété exclusive
                        de TDK Telecom. Toute reproduction non autorisée est interdite.
                    </p>
                </Section>

                <Section title="8. Limitation de responsabilité">
                    <p>
                        TDK Telecom ne peut être tenu responsable des dommages indirects, pertes de données,
                        pertes commerciales ou tout autre préjudice résultant de l&apos;utilisation ou de l&apos;impossibilité
                        d&apos;utiliser le service.
                    </p>
                </Section>

                <Section title="9. Modification des CGU">
                    <p>
                        TDK Telecom se réserve le droit de modifier les présentes CGU à tout moment. Les modifications
                        prennent effet à leur mise en ligne. L&apos;utilisation continue du service vaut acceptation des
                        nouvelles CGU.
                    </p>
                </Section>

                <Section title="10. Droit applicable et juridiction">
                    <p>
                        Les présentes CGU sont soumises au droit sénégalais. Tout litige sera soumis à la juridiction
                        compétente du Sénégal.
                    </p>
                    <p>
                        Pour tout réclamation, contactez-nous :{' '}
                        <a href={`mailto:${COMPANY.email}`} className="text-brand hover:underline">{COMPANY.email}</a>
                        {' '}ou{' '}
                        <a href={`tel:${COMPANY.phone}`} className="text-brand hover:underline">{COMPANY.phoneDisplay}</a>.
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
