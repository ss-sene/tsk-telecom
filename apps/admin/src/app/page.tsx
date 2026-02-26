// apps/admin/src/app/page.tsx
import Link from 'next/link';
import Image from "next/image";

const BRAND = { name: "TDK Telecom", primary: "#1A3C9F" };

export default function PricingPage() {
  return (
      <div className="min-h-screen bg-gray-50 font-sans">

        {/* HEADER SIMPLE */}
        <header style={{ backgroundColor: BRAND.primary }} className="px-6 py-4 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo PNG optimisé par Next.js */}
            <Link href="/" className="flex items-center gap-1">
              <div className="relative h-12 w-10"> {/* Ajustez aspect-ratio selon votre logo */}
                <Image
                    src="/logo.png"
                    alt="TDK Logo"
                    fill // Remplit le conteneur parent relatif
                    className="object-contain object-left"
                    priority // Chargement prioritaire pour le LCP
                    sizes="150px"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-white">TDK Telecom</span>
            </Link>
          </div>
        </header>

        {/* HERO SECTION */}
        <main className="max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">
            Choisissez votre portail captif
          </h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Des designs professionnels, optimisés pour la conversion et prêts à être installés sur vos équipements réseaux au Sénégal.
          </p>

          {/* PRICING CARDS */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">

            {/* OFFRE 1 : 10 000 FCFA */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 flex flex-col hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-gray-900">Pack Standard</h2>
              <p className="text-sm text-gray-500 mt-2">L'essentiel pour démarrer votre zone WiFi.</p>
              <div className="mt-6 flex items-baseline text-5xl font-extrabold text-gray-900">
                10 000<span className="ml-1 text-xl font-medium text-gray-500">FCFA</span>
              </div>
              <ul className="mt-8 space-y-4 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  Design Standard optimisé
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  Intégration Mikrotik facile
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  Support technique par email
                </li>
              </ul>
              {/* Redirection avec paramètres d'URL (State minimaliste) */}
              <Link
                  href="/checkout?plan=Pack+Standard&price=10000"
                  className="mt-8 w-full block text-center bg-gray-900 text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors"
              >
                Choisir ce pack
              </Link>
            </div>

            {/* OFFRE 2 : 12 000 FCFA (Mise en avant) */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 relative flex flex-col " style={{ borderColor: BRAND.primary }}>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full px-4 py-1 text-xs font-bold text-white uppercase tracking-wider" style={{ backgroundColor: BRAND.primary }}>
                Le plus populaire
              </div>
              <h2 className="text-xl font-bold text-gray-900">Pack Premium</h2>
              <p className="text-sm text-gray-500 mt-2">Personnalisation complète pour votre marque.</p>
              <div className="mt-6 flex items-baseline text-5xl font-extrabold text-gray-900">
                12 000<span className="ml-1 text-xl font-medium text-gray-500">FCFA</span>
              </div>
              <ul className="mt-8 space-y-4 flex-1">
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  Design 100% sur mesure
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  Intégration de votre logo
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-700">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                  Support prioritaire WhatsApp
                </li>
              </ul>
              <Link
                  href="/checkout?plan=Pack+Premium&price=12000"
                  style={{ backgroundColor: BRAND.primary }}
                  className="mt-8 w-full block text-center text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity shadow-md"
              >
                Choisir ce pack
              </Link>
            </div>

          </div>
        </main>
      </div>
  );
}