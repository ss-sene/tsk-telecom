// app/checkout/page.tsx
import { Suspense } from 'react';
import { prisma } from '@/core/db/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { CheckoutFormClient } from './CheckoutFormClient';

// ✅ Empêche le pré-rendu statique au build
export const dynamic = 'force-dynamic';

const BRAND = {
    name: "TDK Telecom",
    colors: { primary: "#1A3C9F", primaryHover: "#142E7B", bgGradient: "from-gray-50 to-blue-50" }
};

// --- COMPOSANT PRINCIPAL (Server Component) ---
export default async function CheckoutGateway() {
    // Fetching Server-Side des villages (O(1) réseau)
    const rawVillages = await prisma.village.findMany({
        orderBy: { titre: 'asc' },
        select: { id: true, titre: true }
    });

    // ✅ Normalisation du champ nullable avant passage au composant client
    const villages = rawVillages.map(v => ({
        id: v.id,
        titre: v.titre ?? 'Sans nom',
    }));

    return (
        <div className={`min-h-screen flex flex-col bg-gradient-to-br ${BRAND.colors.bgGradient} font-sans text-gray-900`}>
            <header style={{ backgroundColor: BRAND.colors.primary }} className="px-6 py-4 flex items-center justify-between shadow-md">
                <Link href="/" className="flex items-center gap-1">
                    <div className="relative h-12 w-10">
                        <Image
                            src="/logo.png"
                            alt="TDK Logo"
                            fill
                            className="object-contain object-left"
                            priority
                            sizes="150px"
                        />
                    </div>
                    <span className="text-xl font-black tracking-tight text-white">TDK Telecom</span>
                </Link>
                <div className="flex items-center gap-3">
                    <button type="button" className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-sm font-semibold text-gray-800 shadow-sm">
                        <span className="flex overflow-hidden rounded-sm w-4 h-3 border border-gray-200 relative">
                            <span className="w-1/3 bg-[#00853F]"></span>
                            <span className="w-1/3 bg-[#FDEF42] flex items-center justify-center">
                                <span className="text-[6px] text-[#00853F]">★</span>
                            </span>
                            <span className="w-1/3 bg-[#E31B23]"></span>
                        </span>
                        Sénégal
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 lg:py-16">
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A3C9F]"></div>
                        <span className="text-gray-500 font-medium">Chargement sécurisé...</span>
                    </div>
                }>
                    {/* Injection des données serveur dans le composant client */}
                    <CheckoutFormClient villages={villages} />
                </Suspense>
            </main>
        </div>
    );
}