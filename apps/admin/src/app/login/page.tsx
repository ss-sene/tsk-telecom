'use client';

import { useActionState } from 'react';
import { authenticate } from '@/core/actions/auth.action';
import Image from 'next/image';

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(authenticate, {});

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] dark:bg-slate-900 px-4 py-12">
            <div className="w-full max-w-sm space-y-8 rounded-2xl bg-white dark:bg-slate-800 p-10 shadow-sm ring-1 ring-gray-200 dark:ring-slate-700">

                {/* Logo + Marque */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative h-12 w-12">
                        <Image
                            src="/logo.png"
                            alt="TDK Telecom"
                            fill
                            className="object-contain"
                            priority
                            sizes="48px"
                        />
                    </div>
                    <div className="text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-brand">TDK Telecom</p>
                        <h1 className="mt-1 text-xl font-extrabold text-gray-900 dark:text-slate-100">Espace administrateur</h1>
                    </div>
                </div>

                <form action={formAction} className="space-y-4">
                    <div>
                        <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                            Clé d&apos;accès
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            className="block h-11 w-full rounded-xl border-0 px-4 text-sm text-gray-900 dark:text-slate-100 bg-white dark:bg-slate-700 ring-1 ring-inset ring-gray-300 dark:ring-slate-600 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-brand outline-none"
                            placeholder="••••••••••••"
                        />
                    </div>

                    {state?.error && (
                        <div className="flex items-center gap-2 rounded-xl bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm font-semibold text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-200 dark:ring-red-800">
                            <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                            {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-bold text-white transition-colors hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isPending ? (
                            <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        ) : (
                            'Accéder au dashboard'
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-400 dark:text-slate-500">
                    Accès réservé aux administrateurs TDK Telecom
                </p>
            </div>
        </div>
    );
}
