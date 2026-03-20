// src/hooks/usePayment.ts
'use client';

import { useState } from 'react';
import type { InitiatePaymentDto } from '@/core/validators/payment.schema';

export type { InitiatePaymentDto };

// State machine :
// idle → loading → redirecting (Wave / OM mobile)
//                → om_qr       (OM desktop — afficher QR)
//                → error
export type PaymentState =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'redirecting'; provider: 'WAVE' | 'ORANGE_MONEY'; redirectUrl: string; fees?: number }
    | { status: 'om_qr'; qrUrl: string; omUrl: string; maxitUrl?: string; internalRef: string; fees?: number }
    | { status: 'error'; message: string };

export function usePayment() {
    const [state, setState] = useState<PaymentState>({ status: 'idle' });

    async function initiatePayment(data: InitiatePaymentDto) {
        setState({ status: 'loading' });

        try {
            const res    = await fetch('/api/payment/initiate', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body:    JSON.stringify(data),
            });
            const result = await res.json();

            if (!result.success) {
                setState({ status: 'error', message: result.error ?? 'Erreur inconnue' });
                return;
            }

            if (result.provider === 'WAVE') {
                // Wave → redirection immédiate vers pay.wave.com
                setState({
                    status:      'redirecting',
                    provider:    'WAVE',
                    redirectUrl: result.redirectUrl,
                    fees:        result.fees,
                });
                setTimeout(() => {
                    window.location.href = result.redirectUrl;
                }, 800);
                return;
            }

            if (result.provider === 'ORANGE_MONEY') {
                // Orange Money — détecter mobile vs desktop
                const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

                if (isMobile && result.redirectUrl) {
                    // Mobile → deeplink om_url vers l'app Orange Money
                    setState({
                        status:      'redirecting',
                        provider:    'ORANGE_MONEY',
                        redirectUrl: result.redirectUrl,
                        fees:        result.fees,
                    });
                    setTimeout(() => {
                        window.location.href = result.redirectUrl;
                    }, 800);
                } else {
                    // Desktop → afficher QR code
                    setState({
                        status:      'om_qr',
                        qrUrl:       result.qrUrl,
                        omUrl:       result.redirectUrl,
                        maxitUrl:    result.maxitUrl,
                        internalRef: result.internalRef,
                        fees:        result.fees,
                    });
                }
                return;
            }

        } catch {
            setState({ status: 'error', message: 'Erreur réseau. Vérifiez votre connexion et réessayez.' });
        }
    }

    function reset() {
        setState({ status: 'idle' });
    }

    return { state, initiatePayment, reset };
}