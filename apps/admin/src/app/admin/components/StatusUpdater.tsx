'use client';

import { useState, useTransition } from 'react';
import { PaymentStatus } from '@/generated/prisma/client';
import { updatePaymentStatus } from '@/core/actions/admin.action';

const STATUS_OPTIONS = [
    { value: 'SUCCESS', label: 'Confirmé' },
    { value: 'PENDING', label: 'En attente' },
    { value: 'FAILED', label: 'Échoué' },
    { value: 'REFUNDED', label: 'Remboursé' },
];

export function StatusUpdater({ paymentId, currentStatus }: { paymentId: string; currentStatus: PaymentStatus }) {
    // Rendu optimiste : permet de changer la couleur instantanément au clic
    const [isPending, startTransition] = useTransition();
    const [optimisticStatus, setOptimisticStatus] = useState<PaymentStatus>(currentStatus);

    // Dictionnaire visuel strict
    const styles: Record<PaymentStatus, string> = {
        SUCCESS: 'bg-green-50 text-green-700 ring-green-600/20',
        PENDING: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
        FAILED: 'bg-red-50 text-red-700 ring-red-600/10',
        REFUNDED: 'bg-gray-50 text-gray-600 ring-gray-500/10',
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as PaymentStatus;
        
        // 1. Mise à jour immédiate de l'UI (Feedback visuel en O(1))
        setOptimisticStatus(newStatus); 

        // 2. Exécution de la mutation asynchrone en arrière-plan
        startTransition(async () => {
            const response = await updatePaymentStatus(paymentId, newStatus);
            if (!response.success) {
                // Rollback visuel en cas de coupure réseau ou erreur BDD
                alert(response.error);
                setOptimisticStatus(currentStatus); 
            }
        });
    };

    return (
        <div className="relative inline-flex">
            <select
                value={optimisticStatus}
                onChange={handleChange}
                disabled={isPending}
                className={`appearance-none outline-none cursor-pointer inline-flex items-center rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold ring-1 ring-inset transition-all disabled:opacity-70 disabled:cursor-wait ${styles[optimisticStatus]}`}
            >
                {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="text-gray-900 bg-white">
                        {opt.label}
                    </option>
                ))}
            </select>
            
            {/* Icône d'état (Chevron ou Spinner) */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                {isPending ? (
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70" />
                ) : (
                    <svg className="h-3 w-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </div>
        </div>
    );
}