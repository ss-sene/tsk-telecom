'use client';

import { useState, useTransition } from 'react';
import { toggleProductPublished } from '@/core/actions/catalogue.action';

export function PublishToggle({ id, published }: { id: string; published: boolean }) {
    const [isPending, startTransition] = useTransition();
    const [optimistic, setOptimistic] = useState(published);

    const toggle = () => {
        const next = !optimistic;
        setOptimistic(next);
        startTransition(async () => {
            const res = await toggleProductPublished(id, next);
            if (!res.success) setOptimistic(optimistic);
        });
    };

    return (
        <button
            type="button"
            onClick={toggle}
            disabled={isPending}
            aria-label={optimistic ? 'Dépublier' : 'Publier'}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:opacity-60 ${
                optimistic ? 'bg-brand' : 'bg-gray-200 dark:bg-slate-700'
            }`}
        >
            <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    optimistic ? 'translate-x-4' : 'translate-x-0'
                }`}
            />
        </button>
    );
}
