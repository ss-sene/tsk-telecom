'use client';

import type { ReactNode } from 'react';

interface Props {
    href:       string;
    className?: string;
    children:   ReactNode;
    onClick?:   () => void;
}

/**
 * Lien vers une ancre intra-page avec scroll garanti.
 * - Si l'élément existe sur la page courante : scrollIntoView (fonctionne même
 *   si le hash est déjà dans l'URL — cas non géré par les liens natifs).
 * - Sinon : navigation normale (ex. /#offres depuis /starlink).
 * Le prop onClick est appelé dans les deux cas (ex. fermer un drawer mobile).
 */
export function ScrollLink({ href, className, children, onClick }: Props) {
    function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
        const hash = href.split('#')[1];
        if (hash) {
            const target = document.getElementById(hash);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
                history.replaceState(null, '', `#${hash}`);
            }
        }
        onClick?.();
    }

    return (
        <a href={href} onClick={handleClick} className={className}>
            {children}
        </a>
    );
}
