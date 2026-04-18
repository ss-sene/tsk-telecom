// apps/admin/src/app/admin/catalogue/new/page.tsx
import Link from 'next/link';
import { ProductForm } from '../components/ProductForm';

export default function NewProductPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
            <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                <Link href="/admin/catalogue" className="hover:text-gray-900 dark:hover:text-slate-100 transition-colors">
                    Catalogue
                </Link>
                <span>/</span>
                <span className="text-gray-900 dark:text-slate-100 font-medium">Nouveau produit</span>
            </nav>

            <div className="rounded-2xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-6 shadow-sm">
                <h1 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Nouveau produit</h1>
                <ProductForm product={null} />
            </div>
        </div>
    );
}
