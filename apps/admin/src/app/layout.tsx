import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TDK Telecom — Abonnement Internet",
  description: "Souscrivez à Internet TDK Telecom. Connexion haut débit au Sénégal, payez facilement via Wave ou Orange Money.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark scroll-smooth">
      <body className={`${inter.variable} antialiased selection:bg-brand selection:text-white`}>
        {children}
      </body>
    </html>
  );
}
