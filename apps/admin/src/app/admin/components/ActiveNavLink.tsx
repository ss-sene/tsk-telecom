'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function ActiveNavLink({ href, label }: { href: string; label: string }) {
    const pathname = usePathname();
    const isActive = href === '/admin'
        ? pathname === '/admin'
        : pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={`rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors ${
                isActive
                    ? 'bg-brand-light dark:bg-brand/15 text-brand'
                    : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100'
            }`}
        >
            {label}
        </Link>
    );
}
