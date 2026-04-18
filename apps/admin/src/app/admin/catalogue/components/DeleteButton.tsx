'use client';

import { useTransition } from 'react';
import { deleteProduct } from '@/core/actions/catalogue.action';

export function DeleteButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();

    const handleClick = () => {
        if (!confirm('Supprimer ce produit ?')) return;
        startTransition(async () => { void deleteProduct(id); });
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={isPending}
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
        >
            {isPending ? '…' : 'Suppr.'}
        </button>
    );
}
