'use server';

import { prisma }        from '@/core/db/prisma';
import { revalidatePath } from 'next/cache';
import { z }             from 'zod';

const TitreSchema = z
    .string()
    .trim()
    .min(2, 'Au moins 2 caractères')
    .max(80, 'Maximum 80 caractères');

function capitalise(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export async function addVillage(
    _prev: { error?: string },
    formData: FormData,
): Promise<{ error?: string }> {
    const parsed = TitreSchema.safeParse(formData.get('titre'));
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    try {
        await prisma.village.create({ data: { titre: capitalise(parsed.data) } });
    } catch {
        return { error: 'Ce village existe déjà.' };
    }

    revalidatePath('/admin/villages');
    return {};
}

export async function renameVillage(
    id: string,
    _prev: { error?: string; ok?: boolean },
    formData: FormData,
): Promise<{ error?: string; ok?: boolean }> {
    const parsed = TitreSchema.safeParse(formData.get('titre'));
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    try {
        await prisma.village.update({
            where: { id },
            data:  { titre: capitalise(parsed.data) },
        });
    } catch {
        return { error: 'Ce nom est déjà utilisé.' };
    }

    revalidatePath('/admin/villages');
    return { ok: true };
}

export async function deleteVillage(id: string): Promise<{ error?: string }> {
    const count = await prisma.client.count({ where: { villageId: id } });
    if (count > 0) {
        return { error: `Impossible : ${count} client(s) rattaché(s) à ce village.` };
    }

    await prisma.village.delete({ where: { id } });
    revalidatePath('/admin/villages');
    return {};
}
