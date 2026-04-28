// apps/admin/src/app/admin/layout.tsx
import Link from 'next/link';
import Image from 'next/image';
import { logout } from '@/core/actions/auth.action';
import { MobileNav }      from './components/MobileNav';
import { ActiveNavLink } from './components/ActiveNavLink';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-card dark:bg-slate-900">

            {/* TOP BAR */}
            <nav className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="mx-auto flex h-15 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 py-3">

                    {/* Logo */}
                    <Link href="/admin" className="flex items-center gap-2 shrink-0">
                        <div className="relative h-8 w-8">
                            <Image
                                src="/logo.png"
                                alt="TDK Admin"
                                fill
                                className="object-contain"
                                priority
                                sizes="32px"
                            />
                        </div>
                        <span className="text-base font-extrabold tracking-tight text-brand">TDK Admin</span>
                    </Link>

                    {/* Nav desktop */}
                    <div className="hidden md:flex items-center gap-1 flex-1 ml-4">
                        <ActiveNavLink href="/admin"            label="Transactions" />
                        <ActiveNavLink href="/admin/catalogue"  label="Catalogue" />
                        <ActiveNavLink href="/admin/clients"    label="Clients" />
                        <ActiveNavLink href="/admin/villages"   label="Villages" />
                    </div>

                    {/* Droite : toggle + logout desktop + hamburger mobile */}
                    <div className="flex items-center gap-3">

                        {/* Logout desktop */}
                        <form action={logout} className="hidden md:block">
                            <button
                                type="submit"
                                className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-slate-700 px-3.5 py-2 text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-colors"
                            >
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Déconnexion
                            </button>
                        </form>

                        {/* Mobile nav */}
                        <MobileNav />
                    </div>
                </div>
            </nav>

            <main>
                {children}
            </main>
        </div>
    );
}
