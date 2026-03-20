import { env } from 'process';

const IS_LIVE = env.PAYDUNYA_MODE === 'live';
const BASE_URL = IS_LIVE ? 'https://app.paydunya.com/api/v1' : 'https://app.paydunya.com/sandbox-api/v1';

const HEADERS = {
    'Content-Type': 'application/json',
    'PAYDUNYA-MASTER-KEY': env.PAYDUNYA_MASTER_KEY!,
    'PAYDUNYA-PRIVATE-KEY': env.PAYDUNYA_PRIVATE_KEY!,
    'PAYDUNYA-TOKEN': env.PAYDUNYA_TOKEN!,
};

export interface CreateInvoiceParams {
    amount: number;
    description: string;
    customerName: string;
    customerEmail?: string;
    internalRef: string;
    returnUrl: string;
    cancelUrl: string;
    callbackUrl: string;
}

export type CreateInvoiceResult =
    | { success: true; token: string; checkoutUrl: string }
    | { success: false; message: string };

export async function createInvoice(params: CreateInvoiceParams): Promise<CreateInvoiceResult> {
    const body = {
        invoice: { total_amount: params.amount, description: params.description },
        store: { name: env.PAYDUNYA_STORE_NAME ?? 'TDK Telecom' },
        actions: {
            cancel_url: params.cancelUrl,
            return_url: params.returnUrl,
            callback_url: params.callbackUrl,
        },
        custom_data: {
            internal_ref: params.internalRef,
            customer_name: params.customerName,
            customer_email: params.customerEmail ?? '',
        },
    };

    try {
        const res = await fetch(`${BASE_URL}/checkout-invoice/create`, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify(body),
        });

        const data = await res.json();

        // 00 est le seul code de succès chez PayDunya
        if (data.response_code === '00') {
            return {
                success: true,
                token: data.token,
                checkoutUrl: data.response_text // PayDunya renvoie l'URL de redirection directement ici
            };
        }
        
        return { success: false, message: data.response_text ?? 'Échec création facture' };
    } catch (error) {
        console.error('[PAYDUNYA_NETWORK_ERROR]', error);
        return { success: false, message: 'Erreur réseau de communication avec la passerelle.' };
    }
}