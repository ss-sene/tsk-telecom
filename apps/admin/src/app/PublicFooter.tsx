// Shared footer for /boutique, /starlink, and future public pages.
// Uses absolute paths (/#offres) so it works from any page.
// The landing page keeps its own inline footer with relative anchors (#offres) for smooth-scroll.
import Link  from 'next/link';
import Image from 'next/image';

const FOOTER_LINKS = [
    { href: '/#offres',            label: 'Offres',            as: 'link' as const },
    { href: '/#avantages',         label: 'Avantages',         as: 'link' as const },
    { href: '/#comment-ca-marche', label: 'Comment ça marche', as: 'link' as const },
    { href: '/#faq',               label: 'FAQ',               as: 'link' as const },
    { href: '/boutique',           label: 'Boutique',          as: 'link' as const },
    { href: '/starlink',           label: 'Starlink',          as: 'link' as const },
    { href: '/checkout',           label: "S'abonner",         as: 'link' as const },
    { href: 'mailto:contact@tdktelecom.sn', label: 'Contact',  as: 'a'    as const },
];

export function PublicFooter() {
    return (
        <footer className="border-t border-gray-200 dark:border-slate-700/60 bg-card dark:bg-slate-800 px-5 py-14">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row items-start justify-between gap-10">

                    {/* Marque */}
                    <div className="space-y-3 max-w-[280px]">
                        <div className="flex items-center gap-2">
                            <div className="relative h-8 w-8">
                                <Image src="/logo.png" alt="TDK Telecom" fill className="object-contain" sizes="32px" />
                            </div>
                            <span className="font-black tracking-tight text-brand">TDK Telecom</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed">
                            {"Fournisseur d'accès Internet au Sénégal. Connexion haut débit pour particuliers et entreprises."}
                        </p>
                    </div>

                    {/* Liens */}
                    <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm">
                        {FOOTER_LINKS.map(({ href, label, as: Tag }) =>
                            Tag === 'a' ? (
                                <a key={href} href={href} className="text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition-colors duration-150">
                                    {label}
                                </a>
                            ) : (
                                <Link key={href} href={href} className="text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition-colors duration-150">
                                    {label}
                                </Link>
                            )
                        )}
                    </div>
                </div>

                <div className="mt-10 border-t border-gray-200 dark:border-slate-700/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 dark:text-slate-500">
                    <p>© {new Date().getFullYear()} TDK Telecom. Tous droits réservés.</p>
                    <p>{"Dakar, Sénégal — Internet simple, fiable et pensé pour votre zone."}</p>
                </div>
            </div>
        </footer>
    );
}
