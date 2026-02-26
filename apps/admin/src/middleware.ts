import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configuration stricte du routeur Edge pour cibler uniquement le Dashboard
export const config = {
    matcher: ['/admin/:path*'],
};

export function middleware(request: NextRequest) {
    // 1. Extraction du jeton de session sécurisé (Cookie HttpOnly)
    const sessionToken = request.cookies.get('admin_session')?.value;

    // 2. Validation de l'autorisation (Comparaison en temps constant recommandée en prod)
    // Pour l'instant, validation contre une variable d'environnement forte.
    const isValid = sessionToken && sessionToken === process.env.ADMIN_SECRET_TOKEN;

    if (!isValid) {
        // Redirection 307 (Temporary Redirect) vers une page de connexion
        const loginUrl = new URL('/login', request.url);
        // Sauvegarde de l'URL d'origine pour une redirection post-login fluide
        loginUrl.searchParams.set('from', request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // 3. Laissez passer la requête si le jeton est valide
    return NextResponse.next();
}