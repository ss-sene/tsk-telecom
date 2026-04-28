'use client';

import { useActionState, useEffect, useState } from 'react';
import { renameVillage, deleteVillage }        from '@/core/actions/villages.action';

interface Props {
    id:           string;
    titre:        string;
    clientCount:  number;
    paymentCount: number;
}

export function VillageRow({ id, titre, clientCount, paymentCount }: Props) {
    const [editing,     setEditing]     = useState(false);
    const [deleteError, setDeleteError] = useState('');

    const boundRename = renameVillage.bind(null, id);
    const [renameState, formAction, pending] = useActionState(boundRename, {});

    useEffect(() => {
        if (renameState.ok) setEditing(false);
    }, [renameState.ok]);

    async function handleDelete() {
        setDeleteError('');
        const result = await deleteVillage(id);
        if (result.error) setDeleteError(result.error);
    }

    if (editing) {
        return (
            <tr className="bg-blue-50/30 dark:bg-slate-700/30">
                <td colSpan={4} className="px-5 py-3">
                    <form action={formAction} className="flex flex-wrap items-center gap-2">
                        <input
                            type="text"
                            name="titre"
                            defaultValue={titre}
                            autoFocus
                            required
                            className="h-10 w-64 rounded-xl border-0 px-3 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-700 ring-1 ring-inset ring-gray-200 dark:ring-slate-600 focus:ring-2 focus:ring-brand outline-none"
                        />
                        <button
                            type="submit"
                            disabled={pending}
                            className="flex h-10 items-center gap-1.5 rounded-xl bg-brand px-4 text-sm font-bold text-white hover:bg-brand-hover transition-colors disabled:opacity-50"
                        >
                            Enregistrer
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditing(false)}
                            className="flex h-10 items-center rounded-xl border border-gray-200 dark:border-slate-700 px-4 text-sm font-bold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Annuler
                        </button>
                        {renameState.error && (
                            <span className="text-sm text-red-600 dark:text-red-400">{renameState.error}</span>
                        )}
                    </form>
                </td>
            </tr>
        );
    }

    return (
        <tr className="hover:bg-blue-50/40 dark:hover:bg-slate-700/50 transition-colors">
            <td className="px-5 py-4 font-semibold text-gray-900 dark:text-slate-100">
                {titre}
            </td>
            <td className="px-5 py-4 font-bold text-gray-900 dark:text-slate-100">
                {clientCount}
            </td>
            <td className="px-5 py-4 text-gray-700 dark:text-slate-300">
                {paymentCount}
            </td>
            <td className="px-5 py-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={() => { setDeleteError(''); setEditing(true); }}
                        className="rounded-lg px-3 py-1.5 text-xs font-bold text-brand hover:bg-brand/10 transition-colors"
                    >
                        Renommer
                    </button>
                    {clientCount === 0 && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="rounded-lg px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            Supprimer
                        </button>
                    )}
                    {deleteError && (
                        <span className="text-xs text-red-600 dark:text-red-400">{deleteError}</span>
                    )}
                </div>
            </td>
        </tr>
    );
}
