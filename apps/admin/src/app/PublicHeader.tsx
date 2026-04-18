'use client';

import Link  from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LandingMobileNav } from './LandingMobileNav';

export function PublicHeader() {
    const pathname = usePathname();
    const isHome   = pathname === '/';
    const prefix   = isHome ? '' : '/';

    const NAV = [
        { href: `${prefix}#offres`,            label: 'Offres'    },
        { href: `${prefix}#comment-ca-marche`, label: 'Processus' },
        { href: `${prefix}#faq`,               label: 'FAQ'       },
        { href: '/boutique',                   label: 'Boutique'  },
        { href: '/starlink',                   label: 'Starlink'  },
    ];

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-slate-800/80 bg-white/92 dark:bg-slate-900/92 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">

                <Link href="/" className="flex items-center gap-2.5 shrink-0">
                    <div className="relative h-9 w-9">
                        <Image src="/logo.png" alt="TDK Telecom" fill className="object-contain" priority sizes="36px" />
                    </div>
                    <span className="text-base font-black tracking-tight text-brand">TDK Telecom</span>
                </Link>

                <nav className="hidden md:flex items-center gap-7" aria-label="Navigation principale">
                    {NAV.map(({ href, label }) => {
                        const isActive = !href.includes('#') && (
                            href === '/' ? pathname === '/' : pathname === href
                        );
                        return isActive ? (
                            <span
                                key={href}
                                aria-current="page"
                                className="relative py-1 text-sm font-semibold text-brand after:content-[''] after:absolute after:bottom-0 after:inset-x-0 after:h-px after:rounded-full after:bg-brand"
                            >
                                {label}
                            </span>
                        ) : (
                            <Link
                                key={href}
                                href={href}
                                className="relative py-1 text-sm font-medium text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100 transition-colors duration-150 after:content-[''] after:absolute after:bottom-0 after:inset-x-0 after:h-px after:rounded-full after:bg-brand after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-left"
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2">
                    <LandingMobileNav prefix={prefix} />
                </div>
            </div>
        </header>
    );
}
