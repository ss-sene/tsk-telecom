import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://tdktelecom.sn';

export const metadata: Metadata = {
  title: {
    default:  "TDK Telecom — Internet Haut Débit au Sénégal",
    template: "%s | TDK Telecom",
  },
  description: "TOUBA DAROU KHOUDOSS TELECOM — Internet haut débit au Sénégal. Forfaits dès 10 000 FCFA/mois. Installation accompagnée, paiement Wave ou Orange Money. Partenaire Starlink officiel.",
  metadataBase: new URL(APP_URL),
  keywords: [
    "internet sénégal", "fournisseur accès internet sénégal", "internet haut débit sénégal",
    "internet Touba", "connexion internet Diourbel", "internet village sénégal",
    "abonnement internet wave orange money", "installation internet sénégal",
    "starlink sénégal", "TDK Telecom", "TOUBA DAROU KHOUDOSS TELECOM",
  ],
  openGraph: {
    type:        "website",
    locale:      "fr_SN",
    url:         APP_URL,
    siteName:    "TDK Telecom",
    title:       "TDK Telecom — Internet Haut Débit au Sénégal",
    description: "Internet fiable au Sénégal dès 10 000 FCFA/mois. Paiement Wave ou Orange Money. Partenaire Starlink.",
    images: [
      {
        url:    `${APP_URL}/og-image.png`,
        width:  1424,
        height: 752,
        alt:    "TDK Telecom — Internet Haut Débit au Sénégal",
      },
    ],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "TDK Telecom — Internet Haut Débit au Sénégal",
    description: "Internet fiable au Sénégal dès 10 000 FCFA/mois. Wave & Orange Money.",
    images:      [`${APP_URL}/og-image.png`],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
  alternates: {
    canonical: APP_URL,
  },
  verification: {
    // Ajouter après soumission à Google Search Console :
    // google: 'VOTRE_CODE_VERIFICATION',
  },
};

// ── Organization + LocalBusiness + InternetServiceProvider ──────────────────
const ORG_LD = {
  "@context": "https://schema.org",
  "@type":    ["Organization", "LocalBusiness", "InternetServiceProvider"],
  "@id":      `${APP_URL}/#organization`,
  "name":     "TOUBA DAROU KHOUDOSS TELECOM",
  "alternateName": "TDK Telecom",
  "url":      APP_URL,
  "logo": {
    "@type":       "ImageObject",
    "url":         `${APP_URL}/logo.png`,
    "contentUrl":  `${APP_URL}/logo.png`,
  },
  "image":       `${APP_URL}/og-image.png`,
  "telephone":   "+221771419283",
  "email":       "contact@tdk-telecom.com",
  "priceRange":  "10 000 – 30 000 FCFA",
  "currenciesAccepted": "XOF",
  "paymentAccepted":    "Wave, Orange Money",
  "openingHours":       "Mo-Su 08:00-20:00",
  "areaServed": {
    "@type":  "Country",
    "name":   "Sénégal",
    "sameAs": "https://www.wikidata.org/wiki/Q1041",
  },
  "serviceArea": [
    { "@type": "City",   "name": "Touba Darou Khoudoss", "containedInPlace": { "@type": "State", "name": "Diourbel" } },
    { "@type": "State",  "name": "Diourbel" },
    { "@type": "Country","name": "Sénégal" },
  ],
  "contactPoint": {
    "@type":             "ContactPoint",
    "telephone":         "+221771419283",
    "contactType":       "customer service",
    "areaServed":        "SN",
    "availableLanguage": ["French", "Wolof"],
    "contactOption":     "TollFree",
  },
  "address": {
    "@type":           "PostalAddress",
    "streetAddress":   "Touba Darou Khoudoss",
    "addressLocality": "Touba Darou Khoudoss",
    "addressRegion":   "Diourbel",
    "addressCountry":  "SN",
  },
  "sameAs": [
    "https://wa.me/221771419283",
  ],
};

// ── WebSite schema (active Sitelinks Search Box si pertinent) ──────────────
const WEBSITE_LD = {
  "@context": "https://schema.org",
  "@type":    "WebSite",
  "@id":      `${APP_URL}/#website`,
  "name":     "TDK Telecom",
  "url":      APP_URL,
  "publisher": { "@id": `${APP_URL}/#organization` },
  "inLanguage": "fr-SN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <SpeedInsights />
        {/* Geo tags — local SEO Sénégal */}
        <meta name="geo.region"      content="SN-DB" />
        <meta name="geo.placename"   content="Touba Darou Khoudoss, Diourbel, Sénégal" />
        <meta name="geo.position"    content="14.8500;-15.8800" />
        <meta name="ICBM"            content="14.8500, -15.8800" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_LD) }}
        />
      </head>
      <body className={`${inter.variable} antialiased selection:bg-brand selection:text-[#121A26]`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
