// apps/admin/src/app/admin/layout.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* TOP NAVIGATION BAR */}
            <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
                    {/* Logo PNG optimisé par Next.js */}
                    <Link href="/admin" className="flex items-center gap-1">
                        <div className="relative h-12 w-10"> {/* Ajustez aspect-ratio selon votre logo */}
                            <Image
                                src="/logo.png"
                                alt="TDK Admin Logo"
                                fill // Remplit le conteneur parent relatif
                                className="object-contain object-left"
                                priority // Chargement prioritaire pour le LCP
                                sizes="150px"
                            />
                        </div>
                        <span className="text-xl font-black tracking-tight text-[#1A3C9F]">TDK Admin</span>
                    </Link>

                    {/* Liens de Navigation (Évolutif) */}
                    <div className="hidden md:flex gap-6">
                        <Link href="/admin" className="rounded-lg bg-gray-50 px-3 py-2 text-sm font-bold text-[#1A3C9F]">
                            Transactions
                        </Link>
                        <Link href="#" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                            Clients
                        </Link>
                        {/*<Link href="#" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                            Paramètres
                        </Link>*/}
                    </div>

                    {/* User Profile / Logout */}
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-gray-200 ring-2 ring-white overflow-hidden">
                            <svg className="h-full w-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>

                </div>
            </nav>

            {/* CONTENU DE LA PAGE (Le Dashboard viendra s'injecter ici) */}
            <main>
                {children}
            </main>
        </div>
    );
}