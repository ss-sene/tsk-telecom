// api/payment/initiate/route.ts
// HTTP endpoint for payment initiation — thin adapter over the initiatePayment server action.
// Delegates all business logic (client upsert, DB payment record, Wave/OM call) to the action.
//
// POST /api/payment/initiate
// Body: { provider, amount, phone, firstName, lastName, villageId, email?, newVillageName? }
// Returns: { success, checkoutUrl?, internalRef?, provider?, error? }

export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { initiatePayment }           from '@/core/actions/payment.action';

export async function POST(req: NextRequest) {
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { success: false, error: 'Corps de requête JSON invalide' },
            { status: 400 },
        );
    }

    const result = await initiatePayment(body);

    if (!result.success) {
        return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
}
