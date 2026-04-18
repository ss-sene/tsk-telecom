'use server';

import { prisma } from '@/core/db/prisma';
import { ProductCategory } from '@/generated/prisma/enums';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const CATEGORIES = Object.values(ProductCategory) as [ProductCategory, ...ProductCategory[]];

const ProductSchema = z.object({
    name:             z.string().min(1, 'Nom requis'),
    slug:             z.string().min(1, 'Slug requis').regex(/^[a-z0-9-]+$/, 'Slug invalide (a-z, 0-9, -)'),
    shortDescription: z.string().nullable().optional(),
    description:      z.string().nullable().optional(),
    category:         z.enum(CATEGORIES),
    priceXof:         z.preprocess(
        v => (v === '' || v == null ? null : Number(v)),
        z.number().int().positive().nullable(),
    ),
    priceUnit:        z.string().nullable().optional(),
    speed:            z.string().nullable().optional(),
    featuresRaw:      z.string().default(''),
    highlighted:      z.preprocess(v => v === 'on' || v === true, z.boolean()),
    published:        z.preprocess(v => v === 'on' || v === true, z.boolean()),
    position:         z.preprocess(v => Number(v ?? 0), z.number().int()),
});

function formDataToObject(fd: FormData): Record<string, unknown> {
    const obj: Record<string, unknown> = {};
    fd.forEach((v, k) => { obj[k] = v; });
    return obj;
}

export async function toggleProductPublished(id: string, published: boolean) {
    try {
        await prisma.product.update({ where: { id }, data: { published } });
        revalidatePath('/admin/catalogue');
        return { success: true };
    } catch {
        return { success: false, error: 'Échec de la mise à jour.' };
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({ where: { id } });
        revalidatePath('/admin/catalogue');
        return { success: true };
    } catch {
        return { success: false, error: 'Échec de la suppression.' };
    }
}

export async function upsertProduct(
    id: string | null,
    _prevState: { error?: string } | null,
    formData: FormData,
) {
    const parsed = ProductSchema.safeParse(formDataToObject(formData));

    if (!parsed.success) {
        const msg = parsed.error.issues.map(e => e.message).join(' · ');
        return { error: msg };
    }

    const { featuresRaw, ...rest } = parsed.data;
    const features = featuresRaw
        .split('\n')
        .map(f => f.trim())
        .filter(Boolean);

    const data = { ...rest, features };

    if (id) {
        await prisma.product.update({ where: { id }, data });
    } else {
        await prisma.product.create({ data });
    }

    revalidatePath('/admin/catalogue');
    redirect('/admin/catalogue');
}
