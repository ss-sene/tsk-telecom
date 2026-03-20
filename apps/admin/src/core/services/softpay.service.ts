// src/core/services/softpay.service.ts
// Documentation : https://developers.paydunya.com/doc/EN/softpay
//
// Flow en 2 étapes :
// 1. POST /checkout-invoice/create → token
// 2. POST /softpay/{provider}      → url (Wave) ou om_url + url QR (Orange Money)

import { createHash } from 'crypto';

// --- CONFIG ---

const BASE_URL = process.env.PAYDUNYA_MODE === 'live'
    ? 'https://app.paydunya.com/api/v1'
    : 'https://app.paydunya.com/sandbox-api/v1';

const HEADERS = {
    'Content-Type':       'application/json',
    'PAYDUNYA-MASTER-KEY': process.env.PAYDUNYA_MASTER_KEY!,
    'PAYDUNYA-PRIVATE-KEY': process.env.PAYDUNYA_PRIVATE_KEY!,
    'PAYDUNYA-TOKEN':      process.env.PAYDUNYA_TOKEN!,
};

// --- TYPES ---

export type SoftPayProvider = 'WAVE' | 'ORANGE_MONEY';

export interface ProcessPaymentParams {
    provider:      SoftPayProvider;
    amount:        number;
    phone:         string;        // 9 chiffres sans indicatif ex: "771234567"
    customerName:  string;
    customerEmail: string;        // Requis par PayDunya — fallback: "client@tdk-telecom.sn"
    internalRef:   string;
    callbackUrl:   string;
    returnUrl:     string;
    cancelUrl:     string;
}

// Wave    → deeplink pay.wave.com
// Orange  → om_url (mobile) + url QR code (desktop)
export type ProcessPaymentResult =
    | {
        success:     true;
        token:       string;
        provider:    'WAVE';
        type:        'deeplink';
        redirectUrl: string;       // https://pay.wave.com/...
        fees?:       number;
      }
    | {
        success:     true;
        token:       string;
        provider:    'ORANGE_MONEY';
        type:        'deeplink';
        redirectUrl: string;       // om_url pour mobile
        qrUrl:       string;       // url QR code pour desktop
        maxitUrl?:   string;       // maxit_url optionnel
        fees?:       number;
      }
    | { success: false; message: string };

// --- UTILITAIRE : Vérifier le hash webhook ---
// Le hash PayDunya = SHA-512 de la MASTER_KEY
export function verifyWebhookHash(receivedHash: string): boolean {
    const expectedHash = createHash('sha512')
        .update(process.env.PAYDUNYA_MASTER_KEY!)
        .digest('hex');
    return receivedHash === expectedHash;
}

// --- ÉTAPE 1 : Créer l'invoice (commun à tous les providers) ---

async function createInvoice(params: ProcessPaymentParams): Promise<
    | { success: true; token: string }
    | { success: false; message: string }
> {
    const body = {
        invoice: {
            total_amount: params.amount,
            description:  `Abonnement TDK Telecom — Réf. ${params.internalRef}`,
        },
        store: {
            name: process.env.PAYDUNYA_STORE_NAME ?? 'TDK Telecom',
        },
        actions: {
            cancel_url:   params.cancelUrl,
            return_url:   params.returnUrl,
            callback_url: params.callbackUrl,
        },
        custom_data: {
            internal_ref:   params.internalRef,
            customer_name:  params.customerName,
            customer_email: params.customerEmail,
        },
    };

    try {
        const res  = await fetch(`${BASE_URL}/checkout-invoice/create`, {
            method:  'POST',
            headers: HEADERS,
            body:    JSON.stringify(body),
        });
        const data = await res.json();

        console.log('[softpay] createInvoice →', JSON.stringify(data));

        if (data.response_code === '00') {
            return { success: true, token: data.token };
        }

        return {
            success: false,
            message: data.response_text ?? 'Échec création facture PayDunya',
        };
    } catch (err) {
        console.error('[softpay] createInvoice error:', err);
        return { success: false, message: 'Erreur réseau PayDunya (invoice)' };
    }
}

// --- ÉTAPE 2A : Wave Sénégal ---
// Champ token : wave_senegal_payment_token
// Réponse     : { success: true, url: "https://pay.wave.com/..." }

async function processWave(
    params: ProcessPaymentParams,
    invoiceToken: string
): Promise<ProcessPaymentResult> {
    const body = {
        wave_senegal_fullName:      params.customerName,
        wave_senegal_email:         params.customerEmail,
        wave_senegal_phone:         params.phone,
        wave_senegal_payment_token: invoiceToken,
    };

    try {
        const res  = await fetch(`${BASE_URL}/softpay/wave-senegal`, {
            method:  'POST',
            headers: HEADERS,
            body:    JSON.stringify(body),
        });
        const data = await res.json();

        console.log('[softpay] wave →', JSON.stringify(data));

        if (data.success && data.url) {
            return {
                success:     true,
                token:       invoiceToken,
                provider:    'WAVE',
                type:        'deeplink',
                redirectUrl: data.url,
                fees:        data.fees,
            };
        }

        return {
            success: false,
            message: data.message ?? 'Échec initiation Wave',
        };
    } catch (err) {
        console.error('[softpay] wave error:', err);
        return { success: false, message: 'Erreur réseau Wave' };
    }
}

// --- ÉTAPE 2B : Orange Money Sénégal (nouvelle API QR + deeplink) ---
// Endpoint    : /softpay/new-orange-money-senegal
// Champ token : invoice_token
// Réponse     : { success: true, url: "...QR...", other_url: { om_url, maxit_url } }

async function processOrangeMoney(
    params: ProcessPaymentParams,
    invoiceToken: string
): Promise<ProcessPaymentResult> {
    const body = {
        customer_name:  params.customerName,
        customer_email: params.customerEmail,
        phone_number:   params.phone,
        invoice_token:  invoiceToken,
    };

    try {
        const res  = await fetch(`${BASE_URL}/softpay/new-orange-money-senegal`, {
            method:  'POST',
            headers: HEADERS,
            body:    JSON.stringify(body),
        });
        const data = await res.json();

        console.log('[softpay] orange money →', JSON.stringify(data));

        if (data.success) {
            // om_url = deeplink app mobile OM
            // url    = page QR code (desktop ou fallback)
            const omUrl    = data.other_url?.om_url ?? data.url;
            const qrUrl    = data.url;
            const maxitUrl = data.other_url?.maxit_url;

            return {
                success:     true,
                token:       invoiceToken,
                provider:    'ORANGE_MONEY',
                type:        'deeplink',
                redirectUrl: omUrl,   // priorité mobile
                qrUrl,                // fallback desktop
                maxitUrl,
                fees:        data.fees,
            };
        }

        return {
            success: false,
            message: data.message ?? 'Échec initiation Orange Money',
        };
    } catch (err) {
        console.error('[softpay] orange money error:', err);
        return { success: false, message: 'Erreur réseau Orange Money' };
    }
}

// --- MÉTHODE PRINCIPALE ---

export async function processPayment(
    params: ProcessPaymentParams
): Promise<ProcessPaymentResult> {
    // Étape 1 : invoice
    const invoice = await createInvoice(params);
    if (!invoice.success) {
        return { success: false, message: invoice.message };
    }

    // Étape 2 : provider
    if (params.provider === 'WAVE') {
        return processWave(params, invoice.token);
    }

    return processOrangeMoney(params, invoice.token);
}