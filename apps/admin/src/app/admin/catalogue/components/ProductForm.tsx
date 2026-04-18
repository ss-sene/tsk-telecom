'use client';

import { useActionState } from 'react';
import { upsertProduct } from '@/core/actions/catalogue.action';
import { ProductCategory } from '@/generated/prisma/enums';
import type { ProductModel } from '@/generated/prisma/models/Product';
import Link from 'next/link';

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
    { value: 'INTERNET',   label: 'Internet' },
    { value: 'STARLINK',   label: 'Starlink' },
    { value: 'TELEPHONIE', label: 'Téléphonie' },
    { value: 'EQUIPEMENT', label: 'Équipement réseau' },
    { value: 'AUTRE',      label: 'Autre' },
];

const UNIT_OPTIONS = [
    { value: 'mois',   label: 'Par mois' },
    { value: 'an',     label: 'Par an' },
    { value: 'unique', label: 'Prix unique' },
];

type State = { error?: string } | null;

function slugify(str: string) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-slate-300">{label}</label>
            {children}
            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        </div>
    );
}

const INPUT_CLS = 'rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand/50 transition w-full';

export function ProductForm({ product }: { product: ProductModel | null }) {
    const action = upsertProduct.bind(null, product?.id ?? null);
    const [state, formAction, isPending] = useActionState<State, FormData>(action, null);

    const defaultFeatures = product?.features?.join('\n') ?? '';

    return (
        <form action={formAction} className="space-y-6">
            {state?.error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                    {state.error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Nom du produit *">
                    <input
                        name="name"
                        required
                        defaultValue={product?.name ?? ''}
                        placeholder="Box Fibre 20 Mbps"
                        className={INPUT_CLS}
                        onChange={e => {
                            const slugInput = e.currentTarget.form?.elements.namedItem('slug') as HTMLInputElement | null;
                            if (slugInput && !product) slugInput.value = slugify(e.target.value);
                        }}
                    />
                </Field>

                <Field label="Slug *">
                    <input
                        name="slug"
                        required
                        defaultValue={product?.slug ?? ''}
                        placeholder="box-fibre-20mbps"
                        className={INPUT_CLS}
                    />
                </Field>

                <Field label="Catégorie *">
                    <select name="category" defaultValue={product?.category ?? 'INTERNET'} className={INPUT_CLS}>
                        {CATEGORY_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Description courte">
                    <input
                        name="shortDescription"
                        defaultValue={product?.shortDescription ?? ''}
                        placeholder="Idéal pour les familles connectées"
                        className={INPUT_CLS}
                    />
                </Field>
            </div>

            <Field label="Description longue">
                <textarea
                    name="description"
                    rows={3}
                    defaultValue={product?.description ?? ''}
                    placeholder="Description détaillée du produit…"
                    className={INPUT_CLS}
                />
            </Field>

            <Field label="Caractéristiques (une par ligne)">
                <textarea
                    name="featuresRaw"
                    rows={6}
                    defaultValue={defaultFeatures}
                    placeholder={"Débit garanti 20 Mbps\nFibre optique FTTH\nInstallation incluse"}
                    className={`${INPUT_CLS} font-mono text-xs`}
                />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Field label="Prix (XOF)">
                    <input
                        name="priceXof"
                        type="number"
                        min={0}
                        defaultValue={product?.priceXof ?? ''}
                        placeholder="Sur devis si vide"
                        className={INPUT_CLS}
                    />
                </Field>

                <Field label="Unité de prix">
                    <select name="priceUnit" defaultValue={product?.priceUnit ?? 'mois'} className={INPUT_CLS}>
                        <option value="">—</option>
                        {UNIT_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Débit / Vitesse">
                    <input
                        name="speed"
                        defaultValue={product?.speed ?? ''}
                        placeholder="20 Mbps"
                        className={INPUT_CLS}
                    />
                </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Position (ordre d'affichage)">
                    <input
                        name="position"
                        type="number"
                        defaultValue={product?.position ?? 0}
                        className={INPUT_CLS}
                    />
                </Field>
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                        type="checkbox"
                        name="highlighted"
                        defaultChecked={product?.highlighted ?? false}
                        className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Mise en avant (badge "Populaire")</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                        type="checkbox"
                        name="published"
                        defaultChecked={product?.published ?? false}
                        className="h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Publié (visible sur le site)</span>
                </label>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-slate-700 pt-6">
                <Link
                    href="/admin/catalogue"
                    className="rounded-xl border border-gray-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                    Annuler
                </Link>
                <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2 text-sm font-semibold text-white hover:bg-brand-hover transition-colors disabled:opacity-60"
                >
                    {isPending && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                    {product ? 'Enregistrer' : 'Créer le produit'}
                </button>
            </div>
        </form>
    );
}
