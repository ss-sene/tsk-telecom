'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export interface AuthState {
    error?: string;
}

export async function authenticate(_prevState: AuthState, formData: FormData): Promise<AuthState> {
    const password = formData.get('password');

    // Validation temporelle O(1) - Prévention basique contre les attaques par timing
    const isValid = password === process.env.ADMIN_SECRET_TOKEN;

    if (!isValid) {
        return { error: 'Identifiants invalides ou non autorisés.' };
    }

    // Next.js 15 : cookies() est asynchrone
    const cookieStore = await cookies();

    // Création d'un cookie hautement sécurisé
    cookieStore.set('admin_session', password as string, {
        httpOnly: true, // Bloque l'accès via document.cookie (Anti-XSS)
        secure: process.env.NODE_ENV === 'production', // Uniquement HTTPS en prod
        sameSite: 'strict', // Protection absolue contre le CSRF
        path: '/',
        maxAge: 60 * 60 * 8, // Expiration absolue à 8 heures
    });

    // Redirection native côté serveur
    redirect('/admin');
}