'use client';

import { useActionState, useEffect, useRef } from 'react';
import { addVillage }                        from '@/core/actions/villages.action';

export function AddVillageForm() {
    const [state, formAction, pending] = useActionState(addVillage, {});
    const inputRef = useRef<HTMLInputElement>(null);

    // Clear input after a successful add
    useEffect(() => {
        if (!state.error && inputRef.current) {
            inputRef.current.value = '';
        }
    }, [state]);

    return (
        <form
            action={formAction}
            className="rounded-2xl bg-white dark:bg-slate-800 p-4 shadow-sm ring-1 ring-gray-200 dark:ring-slate-700"
        >
            <div className="flex flex-col sm:flex-row items-end gap-3">
                <div className="flex-1 w-full">
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                        Ajouter un village / une zone
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        name="titre"
                        placeholder="Ex : Touba Nord"
                        required
                        className="block h-11 w-full rounded-xl border-0 px-4 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-700 ring-1 ring-inset ring-gray-200 dark:ring-slate-600 focus:ring-2 focus:ring-brand outline-none placeholder:text-gray-400 dark:placeholder:text-slate-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={pending}
                    className="flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-bold text-white hover:bg-brand-hover transition-colors shadow-sm w-full sm:w-auto disabled:opacity-50 shrink-0"
                >
                    {pending ? 'Ajout…' : 'Ajouter'}
                </button>
            </div>
            {state.error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{state.error}</p>
            )}
        </form>
    );
}
