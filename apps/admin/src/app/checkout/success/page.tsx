// apps/admin/src/app/checkout/success/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const BRAND = {
    name: "TDK Telecom",
    colors: { primary: "#1A3C9F" }
};

function SuccessDetails() {
    const searchParams = useSearchParams();
    const ref = searchParams.get('ref') || 'N/A';
    const plan = searchParams.get('plan') || 'Pack WiFi';

    return (
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 text-center">
            {/* Icône de Succès Animée */}
            <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                    <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Paiement Réussi !</h1>
            <p className="text-gray-500 text-sm mb-8">
                Merci pour votre confiance. Votre accès au **{plan}** est en cours d'activation.
            </p>

            {/* Détails de la transaction */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 space-y-3">
                <div className="flex justify-between text-xs">
                    <span className="text-gray-400 uppercase font-semibold">Référence</span>
                    <span className="text-gray-900 font-mono font-bold">{ref}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-gray-400 uppercase font-semibold">Statut</span>
                    <span className="text-green-600 font-bold uppercase">Confirmé</span>
                </div>
            </div>

            {/* Instructions Post-Paiement */}
            <div className="text-left space-y-4 mb-8">
                <h3 className="text-sm font-bold text-gray-900">Prochaines étapes :</h3>
                <div className="flex gap-3 text-sm text-gray-600">
                    <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">1</span>
                    <p>Vous allez recevoir un SMS de confirmation.</p>
                </div>
                <div className="flex gap-3 text-sm text-gray-600">
                    <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">2</span>
                    <p>Reconnectez-vous au réseau WiFi **TDK_Telecom**.</p>
                </div>
            </div>

            <Link
                href="/"
                className="block w-full py-4 rounded-xl text-white font-bold transition-all hover:opacity-90 shadow-lg"
                style={{ backgroundColor: BRAND.colors.primary }}
            >
                Retour à l'accueil
            </Link>

            <p className="mt-6 text-[10px] text-gray-400">
                Besoin d'aide ? Contactez notre support WhatsApp au +221 77 XXX XX XX
            </p>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
            <Suspense fallback={<div className="text-gray-400 animate-pulse">Chargement de la confirmation...</div>}>
                <SuccessDetails />
            </Suspense>
        </main>
    );
}