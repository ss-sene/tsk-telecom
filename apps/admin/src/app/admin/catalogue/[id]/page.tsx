// apps/admin/src/app/admin/catalogue/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/core/db/prisma';
import { ProductForm } from '../components/ProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) notFound();

    return (
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
            <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                <Link href="/admin/catalogue" className="hover:text-gray-900 dark:hover:text-slate-100 transition-colors">
                    Catalogue
                </Link>
                <span>/</span>
                <span className="text-gray-900 dark:text-slate-100 font-medium line-clamp-1">{product.name}</span>
            </nav>

            <div className="rounded-2xl border border-gray-200 dark:border-slate-700/60 bg-white dark:bg-slate-800 p-6 shadow-sm">
                <h1 className="text-lg font-bold text-gray-900 dark:text-slate-100 mb-6">Modifier le produit</h1>
                <ProductForm product={product} />
            </div>
        </div>
    );
}
