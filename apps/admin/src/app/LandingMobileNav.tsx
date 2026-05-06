'use client';

import Link from 'next/link';
import { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { usePathname }  from 'next/navigation';
import { ScrollLink }   from '@/components/ui/ScrollLink';

const useIsMounted = () =>
    useSyncExternalStore(() => () => {}, () => true, () => false);

export function LandingMobileNav({ prefix = '' }: { prefix?: string }) {
    const pathname = usePathname();

    const NAV_ITEMS = [
        ...(prefix ? [{ href: '/',                          label: 'Accueil'   }] : []),
        { href: `${prefix}#offres`,            label: 'Offres'    },
        { href: `${prefix}#comment-ca-marche`, label: 'Comment ça marche' },
        { href: `${prefix}#faq`,               label: 'FAQ'       },
        { href: '/boutique',                   label: 'Boutique'  },
        { href: '/starlink',                   label: 'Starlink'  },
    ];

    const [open, setOpen] = useState(false);
    const mounted         = useIsMounted();

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    const close = () => setOpen(false);

    const drawer = (
        <div
            id="landing-mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation"
            className="fixed inset-0 z-[999] flex flex-col bg-surface-card"
        >
            <div className="flex items-center justify-between border-b border-border-default px-5 py-4">
                <span className="text-base font-black text-brand">TDK Telecom</span>
                <button
                    type="button"
                    onClick={close}
                    aria-label="Fermer le menu"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border-default text-text-muted hover:bg-surface-raised transition-colors"
                >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto" aria-label="Menu principal">
                {NAV_ITEMS.map(item => {
                    const isActive = !item.href.includes('#') && (
                        item.href === '/' ? pathname === '/' : pathname === item.href
                    );
                    const itemClass = `flex items-center justify-between border-b border-border-faint px-6 py-5 text-base font-semibold transition-colors ${
                        isActive
                            ? 'text-brand bg-brand-light'
                            : 'text-text-secondary hover:bg-surface-raised active:bg-surface-raised'
                    }`;
                    const icon = (
                        <svg className={`h-4 w-4 ${isActive ? 'text-brand' : 'text-text-faint'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    );
                    return item.href.includes('#') ? (
                        <ScrollLink
                            key={item.href}
                            href={item.href}
                            onClick={close}
                            className={itemClass}
                        >
                            {item.label}{icon}
                        </ScrollLink>
                    ) : (
                        <a
                            key={item.href}
                            href={item.href}
                            onClick={close}
                            aria-current={isActive ? 'page' : undefined}
                            className={itemClass}
                        >
                            {item.label}{icon}
                        </a>
                    );
                })}
            </nav>

            {/* CTA principal */}
            <div className="border-t border-border-faint p-5">
                <ScrollLink
                    href={`${prefix}#offres`}
                    onClick={close}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-[#121A26] hover:bg-brand-hover transition-colors shadow-sm"
                >
                    Voir nos offres
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </ScrollLink>
            </div>
        </div>
    );

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                aria-expanded={open}
                aria-controls="landing-mobile-menu"
                aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border-default text-text-muted hover:bg-surface-raised transition-colors"
            >
                {open ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {mounted && open && createPortal(drawer, document.body)}
        </>
    );
}
