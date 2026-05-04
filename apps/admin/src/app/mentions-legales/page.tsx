// apps/admin/src/app/mentions-legales/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicHeader } from '@/app/PublicHeader';
import { PublicFooter } from '@/app/PublicFooter';
import { COMPANY } from '@/lib/company';

export const metadata: Metadata = {
    title:       'Mentions légales',
    description: "Mentions légales de TOUBA DAROU KHOUDOSS TELECOM, fournisseur d'accès Internet au Sénégal.",
    alternates:  { canonical: '/mentions-legales' },
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

export default function MentionsLegalesPage() {
    return (
        <div className="min-h-screen bg-surface-page text-text-base">
            <PublicHeader />

            <main className="mx-auto max-w-3xl px-5 py-16 sm:py-20">

                {/* En-tête */}
                <div className="mb-12">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand mb-3">Légal</p>
                    <h1 className="text-3xl font-black tracking-[-0.03em] text-text-base sm:text-4xl mb-4">
                        Mentions légales
                    </h1>
                    <p className="text-sm text-text-muted">
                        Conformément aux dispositions légales en vigueur au Sénégal.
                        Dernière mise à jour : avril 2026.
                    </p>
                </div>

                <Section title="1. Éditeur du site">
                    <p><span className="font-semibold text-text-secondary">Dénomination sociale :</span> {COMPANY.name}</p>
                    <p><span className="font-semibold text-text-secondary">Activité :</span> Fournisseur d&apos;accès Internet haut débit au Sénégal</p>
                    <p><span className="font-semibold text-text-secondary">Adresse :</span> {COMPANY.address}</p>
                    <p>
                        <span className="font-semibold text-text-secondary">Téléphone :</span>{' '}
                        <a href={`tel:${COMPANY.phone}`} className="text-brand hover:underline">{COMPANY.phoneDisplay}</a>
                    </p>
                    <p>
                        <span className="font-semibold text-text-secondary">Email :</span>{' '}
                        <a href={`mailto:${COMPANY.email}`} className="text-brand hover:underline">{COMPANY.email}</a>
                    </p>
                </Section>

                <Section title="2. Directeur de la publication">
                    <p>
                        Le directeur de la publication est le représentant légal de {COMPANY.name}.
                        Pour toute question relative au contenu du site, contactez-nous à{' '}
                        <a href={`mailto:${COMPANY.email}`} className="text-brand hover:underline">{COMPANY.email}</a>.
                    </p>
                </Section>

                <Section title="3. Hébergement">
                    <p>Ce site est hébergé par :</p>
                    <p className="font-semibold text-text-secondary">Vercel Inc.</p>
                    <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
                    <p>
                        <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                            https://vercel.com
                        </a>
                    </p>
                </Section>

                <Section title="4. Propriété intellectuelle">
                    <p>
                        L&apos;ensemble du contenu publié sur ce site (textes, images, logos, icônes, graphismes) est la propriété
                        exclusive de TOUBA DAROU KHOUDOSS TELECOM, sauf mention contraire.
                    </p>
                    <p>
                        Toute reproduction, représentation, modification, publication, adaptation ou exploitation de tout ou
                        partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans
                        l&apos;autorisation écrite préalable de TOUBA DAROU KHOUDOSS TELECOM.
                    </p>
                </Section>

                <Section title="5. Protection des données personnelles">
                    <p>
                        TOUBA DAROU KHOUDOSS TELECOM collecte des données personnelles (nom, prénom, numéro de téléphone,
                        adresse email) dans le cadre de la souscription à ses services Internet. Ces données sont utilisées
                        exclusivement pour la gestion des abonnements et des paiements, et ne sont jamais transmises à
                        des tiers à des fins commerciales.
                    </p>
                    <p>
                        Conformément à la loi sénégalaise n° 2008-12 du 25 janvier 2008 portant sur la protection des données
                        à caractère personnel, vous disposez d&apos;un droit d&apos;accès, de rectification, de mise à jour et de
                        suppression des données vous concernant.
                    </p>
                    <p>
                        Pour exercer ces droits, contactez-nous par email à{' '}
                        <a href={`mailto:${COMPANY.email}`} className="text-brand hover:underline">{COMPANY.email}</a>{' '}
                        ou par téléphone au{' '}
                        <a href={`tel:${COMPANY.phone}`} className="text-brand hover:underline">{COMPANY.phoneDisplay}</a>.
                    </p>
                </Section>

                <Section title="6. Cookies">
                    <p>
                        Ce site utilise uniquement des cookies techniques strictement nécessaires à son fonctionnement
                        (session d&apos;authentification pour l&apos;espace administrateur). Aucun cookie de suivi publicitaire
                        ou de profilage n&apos;est utilisé.
                    </p>
                </Section>

                <Section title="7. Paiements">
                    <p>
                        Les paiements effectués via ce site (Wave, Orange Money) sont traités par les opérateurs de
                        paiement mobile respectifs. TOUBA DAROU KHOUDOSS TELECOM ne stocke aucune donnée bancaire
                        ou de carte de crédit. Les transactions sont chiffrées et sécurisées.
                    </p>
                </Section>

                <Section title="8. Limitation de responsabilité">
                    <p>
                        TOUBA DAROU KHOUDOSS TELECOM s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations
                        diffusées sur ce site. Toutefois, la société ne peut garantir l&apos;exactitude, la précision ou
                        l&apos;exhaustivité des informations mises à disposition.
                    </p>
                    <p>
                        La société décline toute responsabilité pour toute interruption du service, survenance de bugs,
                        inexactitude ou omission portant sur des informations disponibles sur ce site.
                    </p>
                </Section>

                <Section title="9. Droit applicable">
                    <p>
                        Les présentes mentions légales sont soumises au droit sénégalais. En cas de litige, les tribunaux
                        sénégalais seront seuls compétents.
                    </p>
                </Section>

                {/* Retour */}
                <div className="mt-12 pt-8 border-t border-border-default">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-text-base transition-colors"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Retour à l&apos;accueil
                    </Link>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
