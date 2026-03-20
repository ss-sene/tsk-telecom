'use client';

import { useState } from 'react';
import { usePayment } from '@/hooks/usePayment';
import { InitiatePaymentSchema } from '@/core/validators/payment.schema';

interface Village {
    id:    string;
    titre: string;
}

interface Props {
    villages: Village[];
}

const PLANS = [
    { id: 'Pack Standard', label: 'Pack Standard', price: 10000, speed: '5 Mbps' },
    { id: 'Pack Premium',  label: 'Pack Premium',  price: 12000, speed: '10 Mbps' },
];

export function CheckoutFormClient({ villages }: Props) {
    const { state, initiatePayment, reset } = usePayment();

    const [firstName,      setFirstName]      = useState('');
    const [lastName,       setLastName]        = useState('');
    const [email,          setEmail]           = useState('');
    const [phone,          setPhone]           = useState('');
    const [villageId,      setVillageId]       = useState('');
    const [newVillageName, setNewVillageName]  = useState('');
    const [plan,           setPlan]            = useState(PLANS[0].id);
    const [provider,       setProvider]        = useState<'WAVE' | 'ORANGE_MONEY'>('WAVE');
    const [errors,         setErrors]          = useState<Record<string, string>>({});

    const selectedPlan = PLANS.find(p => p.id === plan) ?? PLANS[0];

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrors({});

        const payload = {
            firstName,
            lastName,
            email:          email || undefined,
            phone,
            villageId:      villageId || '',
            newVillageName: villageId === 'OTHER' ? newVillageName : undefined,
            amount:         selectedPlan.price,
            provider,
        };

        const parsed = InitiatePaymentSchema.safeParse(payload);
        if (!parsed.success) {
            const fieldErrors: Record<string, string> = {};
            for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
                fieldErrors[key] = (msgs as string[])[0] ?? '';
            }
            setErrors(fieldErrors);
            return;
        }

        initiatePayment(parsed.data);
    }

    // --- ÉTAT : Redirection en cours ---
    if (state.status === 'redirecting') {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
                <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-[#1A3C9F]" />
                <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                        {state.provider === 'WAVE'
                            ? 'Redirection vers Wave...'
                            : 'Redirection vers Orange Money...'}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Vous allez être redirigé vers votre application de paiement.
                    </p>
                    {state.fees && (
                        <p className="text-xs text-gray-400 mt-2">
                            Frais : {state.fees.toLocaleString('fr-FR')} FCFA
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // --- ÉTAT : QR Code Orange Money (desktop) ---
    if (state.status === 'om_qr') {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <div className="bg-white rounded-3xl ring-1 ring-gray-200 p-8 space-y-6">
                    <div>
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
                            <span className="text-2xl">🟠</span>
                        </div>
                        <h2 className="text-xl font-extrabold text-gray-900">Paiement Orange Money</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Scannez le QR code avec votre application Orange Money
                        </p>
                    </div>

                    {/* QR Code — iframe de la page PayDunya avec le QR */}
                    <div className="rounded-2xl overflow-hidden border border-gray-200">
                        <img
                            src={state.qrUrl}
                            alt="QR Code Orange Money"
                            className="w-full"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    </div>

                    {/* Deeplink fallback si sur mobile malgré tout */}
                    <a
                        href={state.omUrl}
                        className="flex h-11 items-center justify-center rounded-xl bg-orange-500 text-sm font-bold text-white w-full"
                    >
                        Ouvrir l&apos;app Orange Money
                    </a>

                    {state.maxitUrl && (
                        <a
                            href={state.maxitUrl}
                            className="flex h-11 items-center justify-center rounded-xl border border-gray-300 text-sm font-bold text-gray-700 w-full"
                        >
                            Ouvrir Maxit
                        </a>
                    )}

                    {state.fees && (
                        <p className="text-xs text-gray-400">
                            Frais : {state.fees.toLocaleString('fr-FR')} FCFA
                        </p>
                    )}

                    <button
                        onClick={reset}
                        className="text-sm text-gray-500 underline"
                    >
                        Annuler et revenir
                    </button>
                </div>
            </div>
        );
    }

    // --- ÉTAT : Erreur ---
    if (state.status === 'error') {
        return (
            <div className="max-w-lg mx-auto text-center py-16">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-2">Une erreur est survenue</h2>
                <p className="text-gray-500 mb-6">{state.message}</p>
                <button
                    onClick={reset}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[#1A3C9F] px-8 text-sm font-bold text-white"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    // --- FORMULAIRE PRINCIPAL ---
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

            {/* COLONNE GAUCHE : Formulaire */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">Souscrire à Internet TDK</h1>
                    <p className="mt-1 text-gray-500">Remplissez le formulaire pour finaliser votre abonnement.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Identité */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Prénom</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                placeholder="Mamadou"
                                className="block h-11 w-full rounded-xl border-0 px-4 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-[#1A3C9F]"
                            />
                            {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Nom</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                placeholder="Diallo"
                                className="block h-11 w-full rounded-xl border-0 px-4 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-[#1A3C9F]"
                            />
                            {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                        </div>
                    </div>

                    {/* Téléphone Mobile Money */}
                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                            Numéro Mobile Money
                        </label>
                        <div className="flex">
                            <span className="inline-flex h-11 items-center rounded-l-xl border-0 bg-gray-100 px-3 text-sm font-bold text-gray-500 ring-1 ring-inset ring-gray-300">
                                +221
                            </span>
                            <input
                                type="tel"
                                value={phone}
                                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 9))}
                                placeholder="77 123 45 67"
                                className="block h-11 w-full rounded-r-xl border-0 px-4 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-[#1A3C9F]"
                            />
                        </div>
                        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                    </div>

                    {/* Email facultatif */}
                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                            Email <span className="font-normal text-gray-400">(facultatif)</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="mamadou@example.com"
                            className="block h-11 w-full rounded-xl border-0 px-4 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-[#1A3C9F]"
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {/* Zone de couverture */}
                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Zone de couverture</label>
                        <select
                            value={villageId}
                            onChange={e => setVillageId(e.target.value)}
                            className="block h-11 w-full rounded-xl border-0 bg-white px-4 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-[#1A3C9F]"
                        >
                            <option value="">Sélectionner une zone...</option>
                            {villages.map(v => (
                                <option key={v.id} value={v.id}>{v.titre}</option>
                            ))}
                            <option value="OTHER">Autre zone...</option>
                        </select>
                        {errors.villageId && <p className="mt-1 text-xs text-red-500">{errors.villageId}</p>}
                    </div>

                    {/* Nouvelle zone conditionnelle */}
                    {villageId === 'OTHER' && (
                        <div>
                            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">Nom de votre zone</label>
                            <input
                                type="text"
                                value={newVillageName}
                                onChange={e => setNewVillageName(e.target.value)}
                                placeholder="Ex: Quartier Liberté 6"
                                className="block h-11 w-full rounded-xl border-0 px-4 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-[#1A3C9F]"
                            />
                            {errors.newVillageName && <p className="mt-1 text-xs text-red-500">{errors.newVillageName}</p>}
                        </div>
                    )}

                    {/* Choix opérateur */}
                    <div>
                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Moyen de paiement</label>
                        <div className="grid grid-cols-2 gap-3">

                            {/* Wave */}
                            <button
                                type="button"
                                onClick={() => setProvider('WAVE')}
                                className={`flex items-center justify-center gap-2 h-14 rounded-xl border-2 font-bold text-sm transition-all ${
                                    provider === 'WAVE'
                                        ? 'border-[#1A3C9F] bg-blue-50 text-[#1A3C9F]'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                }`}
                            >
                                <span className="text-lg">🌊</span>
                                Wave
                                {provider === 'WAVE' && (
                                    <span className="ml-1 h-4 w-4 rounded-full bg-[#1A3C9F] flex items-center justify-center">
                                        <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}
                            </button>

                            {/* Orange Money */}
                            <button
                                type="button"
                                onClick={() => setProvider('ORANGE_MONEY')}
                                className={`flex items-center justify-center gap-2 h-14 rounded-xl border-2 font-bold text-sm transition-all ${
                                    provider === 'ORANGE_MONEY'
                                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                }`}
                            >
                                <span className="text-lg">🟠</span>
                                Orange Money
                                {provider === 'ORANGE_MONEY' && (
                                    <span className="ml-1 h-4 w-4 rounded-full bg-orange-500 flex items-center justify-center">
                                        <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={state.status === 'loading'}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1A3C9F] text-sm font-bold text-white shadow-md transition-all hover:bg-[#142E7B] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {state.status === 'loading' ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Traitement en cours...
                            </>
                        ) : (
                            <>
                                Payer {selectedPlan.price.toLocaleString('fr-FR')} FCFA
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                        Paiement sécurisé via PayDunya · TDK Telecom
                    </p>
                </form>
            </div>

            {/* COLONNE DROITE : Offres */}
            <div className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Choisir une offre</h2>

                {PLANS.map(p => (
                    <button
                        key={p.id}
                        type="button"
                        onClick={() => setPlan(p.id)}
                        className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${
                            plan === p.id
                                ? 'border-[#1A3C9F] bg-blue-50'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`font-extrabold text-base ${plan === p.id ? 'text-[#1A3C9F]' : 'text-gray-900'}`}>
                                    {p.label}
                                </p>
                                <p className="text-sm text-gray-500 mt-0.5">Débit {p.speed}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-extrabold text-lg text-gray-900">
                                    {p.price.toLocaleString('fr-FR')} <span className="text-sm font-bold">FCFA</span>
                                </p>
                                <p className="text-xs text-gray-400">/ mois</p>
                            </div>
                        </div>
                    </button>
                ))}

                {/* Récapitulatif */}
                <div className="rounded-2xl bg-gray-900 p-5 text-white">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Récapitulatif</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Offre</span>
                            <span className="font-bold">{selectedPlan.label}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Débit</span>
                            <span className="font-bold">{selectedPlan.speed}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Opérateur</span>
                            <span className="font-bold">{provider === 'WAVE' ? 'Wave' : 'Orange Money'}</span>
                        </div>
                        <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between">
                            <span className="text-gray-400">Total</span>
                            <span className="font-extrabold text-lg">{selectedPlan.price.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}