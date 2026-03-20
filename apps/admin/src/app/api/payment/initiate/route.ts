import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/core/db/prisma';
import { InitiatePaymentSchema } from '@/core/validators/payment.schema';
import { createInvoice } from '@/core/services/paydunya.service';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = InitiatePaymentSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ success: false, error: 'Payload invalide' }, { status: 400 });
        }

        const dto = parsed.data;
        const internalRef = `TDK-${Date.now()}`;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

        // 1. Résolution Village
        let finalVillageId = dto.villageId;
        if (dto.villageId === 'OTHER' && dto.newVillageName) {
            const village = await prisma.village.upsert({
                where: { titre: dto.newVillageName },
                update: {},
                create: { titre: dto.newVillageName }
            });
            finalVillageId = village.id;
        }

        // 2. Upsert Client
        const client = await prisma.client.upsert({
            where: { phone: dto.phone },
            update: { firstName: dto.firstName, lastName: dto.lastName, villageId: finalVillageId, email: dto.email || null },
            create: { phone: dto.phone, firstName: dto.firstName, lastName: dto.lastName, villageId: finalVillageId, email: dto.email || null },
        });

        // 3. Création PENDING
        const payment = await prisma.payment.create({
            data: {
                amount: dto.amount,
                provider: dto.provider,
                internalRef,
                clientId: client.id,
            },
        });

        // 4. Appel Gateway
        const invoice = await createInvoice({
            amount: dto.amount,
            description: `Souscription TDK - ${dto.phone}`,
            customerName: `${dto.firstName} ${dto.lastName}`,
            customerEmail: dto.email || 'client@tdk-telecom.sn',
            internalRef: internalRef,
            returnUrl: `${appUrl}/payment/success?ref=${internalRef}`,
            cancelUrl: `${appUrl}/payment/cancel?ref=${internalRef}`,
            callbackUrl: `${appUrl}/api/payment/webhook`
        });

        if (!invoice.success) {
            await prisma.payment.update({
                where: { id: payment.id },
                data: { status: 'FAILED', errorMessage: invoice.message }
            });
            return NextResponse.json({ success: false, error: invoice.message }, { status: 502 });
        }

        // 5. Mise à jour de la référence externe
        await prisma.payment.update({
            where: { id: payment.id },
            data: { providerRef: invoice.token }
        });

        return NextResponse.json({ success: true, checkoutUrl: invoice.checkoutUrl, internalRef });

    } catch (error) {
        console.error('[PAYMENT_INIT_ERROR]', error);
        return NextResponse.json({ success: false, error: 'Erreur interne' }, { status: 500 });
    }
}