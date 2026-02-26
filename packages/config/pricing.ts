export const TDK_PLANS = {
    STANDARD: {
        id: "standard",
        name: "Pack Standard",
        price: 10000,
        speed: "Jusqu'à 15 Mbps",
        features: ["Connexion illimitée 24/7", "Routeur inclus", "Support client local", "Idéal pour 2-3 appareils"],
        isPopular: false,
    },
    PREMIUM: {
        id: "premium",
        name: "Pack Premium",
        price: 12000,
        speed: "Jusqu'à 30 Mbps",
        features: ["Connexion illimitée 24/7", "Routeur double bande", "Support prioritaire 24/7", "Idéal pour le streaming & gaming"],
        isPopular: true,
    }
} as const; // Le 'as const' garantit l'immuabilité et un typage strict (Readonly)

// Helper typé pour extraire les valeurs sous forme de tableau (utile pour les maps)
export const TDK_PLANS_ARRAY = Object.values(TDK_PLANS);

// Helper pour récupérer un prix dynamique via le nom du plan
export const getPriceByPlanName = (planName: string): number | undefined => {
    return TDK_PLANS_ARRAY.find(p => p.name === planName)?.price;
};