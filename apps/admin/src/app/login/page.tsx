'use client';

import { useActionState } from 'react';
import { authenticate } from '@/core/actions/auth.action';

export default function LoginPage() {
    // Hook React 19 pour la gestion d'état des Server Actions
    const [state, formAction, isPending] = useActionState(authenticate, {});

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-10 shadow-xl ring-1 ring-gray-200">

                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-gray-900">
                        Accès Restreint
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Veuillez vous authentifier pour accéder au dashboard TDK.
                    </p>
                </div>

                <form action={formAction} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="password" className="sr-only">Clé d'accès</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="relative block w-full appearance-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors focus:z-10 focus:border-[#1A3C9F] focus:outline-none focus:ring-[#1A3C9F] sm:text-sm"
                                placeholder="Clé d'accès administrateur"
                            />
                        </div>
                    </div>

                    {state?.error && (
                        <div className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-700 ring-1 ring-inset ring-red-600/20">
                            {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="group relative flex w-full justify-center rounded-xl bg-[#1A3C9F] px-4 py-3 text-sm font-bold text-white transition-all hover:bg-[#142E7B] focus:outline-none focus:ring-2 focus:ring-[#1A3C9F] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isPending ? (
                            <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
}