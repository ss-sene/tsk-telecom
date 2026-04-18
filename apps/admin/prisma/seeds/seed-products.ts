/**
 * seed-products.ts
 *
 * Peuple la table Product.
 *
 * Mode 1 — Données statiques TDK (services ISP) :
 *   pnpm db:seed
 *
 * Mode 2 — Import catalogue matériel WOBICOM :
 *   SEED_FROM_EXCEL=true pnpm db:seed
 *   (fichier attendu : prisma/seeds/WOBICOM-Catalog.xlsx)
 */

import 'dotenv/config';
import path from 'path';
import * as XLSX from 'xlsx';
import { PrismaClient } from '../../src/generated/prisma/client';
import { ProductCategory } from '../../src/generated/prisma/enums';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
});

// ─── Types internes ───────────────────────────────────────────────────────────

type ProductData = Parameters<typeof prisma.product.create>[0]['data'];

// ─── Données statiques — Services ISP TDK ────────────────────────────────────

const STATIC_PRODUCTS: ProductData[] = [
  {
    name: 'Box Internet 2 Mbps',
    slug: 'box-internet-2mbps',
    shortDescription: 'Connexion haut débit pour les usages essentiels',
    description: 'Idéal pour la navigation web, les emails et les réseaux sociaux. Couverture nationale.',
    category: ProductCategory.INTERNET,
    priceXof: 10000,
    priceUnit: 'mois',
    speed: '2 Mbps',
    features: [
      'Débit garanti 2 Mbps',
      'Routeur Wi-Fi inclus',
      'Installation incluse',
      'Support technique 7j/7',
    ],
    highlighted: false,
    published: true,
    position: 10,
  },
  {
    name: 'Box Internet 4 Mbps',
    slug: 'box-internet-4mbps',
    shortDescription: 'Idéal pour les familles et le télétravail léger',
    description: 'Navigation fluide pour plusieurs appareils simultanés. Streaming HD possible.',
    category: ProductCategory.INTERNET,
    priceXof: 18000,
    priceUnit: 'mois',
    speed: '4 Mbps',
    features: [
      'Débit garanti 4 Mbps',
      'Routeur Wi-Fi double bande',
      'Installation incluse',
      'Support technique 7j/7',
      "Jusqu'à 5 appareils connectés",
    ],
    highlighted: false,
    published: true,
    position: 20,
  },
  {
    name: 'Box Fibre 10 Mbps',
    slug: 'box-fibre-10mbps',
    shortDescription: 'La puissance de la fibre pour votre foyer',
    description: 'Connexion fibre optique pour un streaming fluide, les appels vidéo et le gaming.',
    category: ProductCategory.INTERNET,
    priceXof: 30000,
    priceUnit: 'mois',
    speed: '10 Mbps',
    features: [
      'Fibre optique FTTH',
      'Débit symétrique 10 Mbps',
      'Routeur Wi-Fi 6 inclus',
      'Installation incluse',
      'Support prioritaire',
    ],
    highlighted: true,
    published: true,
    position: 30,
  },
  {
    name: 'Box Fibre 20 Mbps',
    slug: 'box-fibre-20mbps',
    shortDescription: 'Haut débit pour les familles connectées',
    description: 'Fibre optique haute performance pour toute la maison. Streaming 4K, gaming, vidéoconférences.',
    category: ProductCategory.INTERNET,
    priceXof: 50000,
    priceUnit: 'mois',
    speed: '20 Mbps',
    features: [
      'Fibre optique FTTH',
      'Débit symétrique 20 Mbps',
      'Routeur Wi-Fi 6 inclus',
      'Installation incluse',
      'IP fixe disponible',
      'Support prioritaire 24h/24',
    ],
    highlighted: false,
    published: true,
    position: 40,
  },
  {
    name: 'Box Fibre 50 Mbps',
    slug: 'box-fibre-50mbps',
    shortDescription: 'Pour les professionnels et les grandes familles',
    description: "La meilleure expérience Internet à domicile. Idéal pour le télétravail intensif et les loisirs numériques.",
    category: ProductCategory.INTERNET,
    priceXof: 80000,
    priceUnit: 'mois',
    speed: '50 Mbps',
    features: [
      'Fibre optique FTTH',
      'Débit symétrique 50 Mbps',
      'Routeur Wi-Fi 6 Pro inclus',
      'Installation incluse',
      'IP fixe incluse',
      'SLA 99,9% garanti',
      'Support dédié 24h/24',
    ],
    highlighted: false,
    published: true,
    position: 50,
  },
  {
    name: 'Starlink Résidentiel',
    slug: 'starlink-residentiel',
    shortDescription: 'Internet par satellite partout au Sénégal',
    description: "Couverture satellite Starlink — haut débit dans les zones rurales et reculées. Kit antenne + installation par nos techniciens agréés.",
    category: ProductCategory.STARLINK,
    priceXof: 45000,
    priceUnit: 'mois',
    speed: '25–100 Mbps',
    features: [
      'Couverture nationale par satellite',
      'Débit 25–100 Mbps selon conditions',
      'Kit antenne Starlink inclus',
      'Installation par technicien agréé',
      'Fonctionne sans réseau filaire',
      'Idéal zones rurales et villageoises',
    ],
    highlighted: true,
    published: true,
    position: 100,
  },
  {
    name: 'Starlink Business',
    slug: 'starlink-business',
    shortDescription: 'Performance satellite pour les entreprises',
    description: "Solution Starlink prioritaire pour les entreprises, ONG et institutions. Débit garanti avec SLA dédié.",
    category: ProductCategory.STARLINK,
    priceXof: null,
    priceUnit: 'mois',
    speed: '40–220 Mbps',
    features: [
      'Débit prioritaire garanti',
      'Kit antenne Business inclus',
      'SLA entreprise dédié',
      'IP fixe incluse',
      'Support technique premium',
      'Facturation sur devis',
    ],
    highlighted: false,
    published: true,
    position: 110,
  },
  {
    name: 'Pack Téléphonie IP',
    slug: 'pack-telephonie-ip',
    shortDescription: 'Téléphonie professionnelle sur IP',
    description: "Solution VoIP pour entreprises : numéros locaux, international illimité, standard virtuel.",
    category: ProductCategory.TELEPHONIE,
    priceXof: null,
    priceUnit: 'mois',
    speed: null,
    features: [
      'Numéros locaux Dakar inclus',
      'Appels internationaux illimités',
      'Standard virtuel (IVR)',
      'Application mobile incluse',
      'Portabilité de numéro',
    ],
    highlighted: false,
    published: false,
    position: 200,
  },
];

// ─── Parser WOBICOM ───────────────────────────────────────────────────────────

/**
 * Structure du fichier WOBICOM-Catalog(2026Q1).xlsx :
 *   Col A : Type/sous-type WiFi (WIFi4, WIFi5, WiFi6…) ou header catégorie
 *   Col B : Modèle (WR300K, T500, G2000…)
 *   Col C : Image (vide)
 *   Col D : Key Features (bullet points séparés par \n)
 *   Col E : Prix (USD/PC)
 *   Col F : Infos emballage
 */

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Extrait les bullet points "● feature\n● ..." en tableau de chaînes. */
function parseFeatures(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split('\n')
    .map(line => line.replace(/^[●•\-\s]+/, '').trim())
    .filter(Boolean);
}

/** Tente d'extraire une vitesse principale depuis les features (ex : "867Mbps", "3000M WiFi6"). */
function extractSpeed(features: string[]): string | null {
  for (const f of features) {
    const m = f.match(/(\d[\d.,]*\s*(?:Gbps|Mbps|Kbps))/i);
    if (m) return m[1];
  }
  return null;
}

/**
 * Mapping des catégories WOBICOM vers une description courte lisible.
 * Toutes les entrées WOBICOM sont catégorisées EQUIPEMENT.
 */
function shortDescFromCategory(mainCat: string, subType: string | null): string {
  const base = mainCat.replace('4G/5G Wireless Router', 'Routeur 4G/5G')
    .replace('Outdoor PtP/PtMP Radio', 'Radio outdoor PtP/PtMP')
    .replace('Indoor Access Point', 'Borne Wi-Fi intérieure')
    .replace('Outdoor Access Point', 'Borne Wi-Fi extérieure')
    .replace('AP Controller', 'Contrôleur de bornes Wi-Fi')
    .replace('GPON/EPON/ONU', 'ONU GPON/EPON');
  return subType ? `${base} ${subType}` : base;
}

function importFromExcel(filePath: string): ProductData[] {
  console.log(`📂  Lecture : ${filePath}`);
  const wb = XLSX.readFile(filePath);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(ws, {
    header: 1,
    defval: null,
  });

  const products: ProductData[] = [];
  let mainCategory = 'Équipement réseau';
  let currentSubType: string | null = null;
  let position = 1000; // Démarre après les services ISP

  // Catégories WOBICOM reconnues comme headers de section (pas des produits)
  const MAIN_CATEGORY_HEADERS = new Set([
    'WiFi Router',
    'GPON/EPON/ONU',
    '4G/5G Wireless Router',
    'Outdoor PtP/PtMP Radio',
    'Indoor Access Point',
    'Outdoor Access Point',
    'AP Controller',
    'Outdoor PTP Bridge',
    'Outdoor PtMP Radio in Pairs',
  ]);

  for (const row of rows) {
    const colA = row[0] != null ? String(row[0]).trim() : null;
    const colB = row[1] != null ? String(row[1]).trim() : null; // Model
    const colD = row[3] != null ? String(row[3]).trim() : null; // Features
    const colE = row[4];                                         // Price USD

    const hasModel = colB && colB.length > 0;
    const hasPrice = typeof colE === 'number' && colE > 0;

    // Header de catégorie principale (ex : "WiFi Router", "GPON/EPON/ONU")
    if (colA && MAIN_CATEGORY_HEADERS.has(colA) && !hasModel) {
      mainCategory = colA;
      currentSubType = null;
      continue;
    }

    // Ligne produit (a un modèle et un prix)
    if (hasModel && hasPrice) {
      // Si Col A est rempli sur une ligne produit → nouveau sous-type
      if (colA && !MAIN_CATEGORY_HEADERS.has(colA)) {
        currentSubType = colA;
      }

      const features = parseFeatures(colD ?? undefined);
      const speed = extractSpeed(features);
      const model = colB!;
      const name = `WOBICOM ${model}`;

      products.push({
        name,
        slug: slugify(name),
        shortDescription: shortDescFromCategory(mainCategory, currentSubType),
        description: features.slice(0, 3).join(' · ') || null,
        category: ProductCategory.EQUIPEMENT,
        priceXof: null,          // Prix wholesale USD — ne pas publier tel quel
        priceUnit: 'unique',
        speed,
        features,
        highlighted: false,
        published: false,         // À valider manuellement avant publication
        position: position++,
      });
    }
  }

  return products;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const useExcel = process.env.SEED_FROM_EXCEL === 'true';
  const excelPath = path.resolve(
    __dirname,
    // Chemin par défaut — peut être remplacé via env
    process.env.EXCEL_PATH ?? 'WOBICOM-Catalog.xlsx',
  );

  let products: ProductData[] = STATIC_PRODUCTS;

  if (useExcel) {
    try {
      const imported = importFromExcel(excelPath);
      console.log(`✅  ${imported.length} produits lus depuis Excel.`);
      products = [...STATIC_PRODUCTS, ...imported];
    } catch (err) {
      console.error(`❌  Impossible de lire : ${excelPath}`);
      console.error(err);
      process.exit(1);
    }
  } else {
    console.log(`ℹ️   Données statiques (${products.length} produits ISP).`);
    console.log(`    Import WOBICOM : SEED_FROM_EXCEL=true EXCEL_PATH=<chemin> pnpm db:seed`);
  }

  console.log('\n🌱  Insertion des produits...\n');

  let created = 0;
  let updated = 0;

  for (const data of products) {
    const slug = data.slug as string;
    const existing = await prisma.product.findUnique({ where: { slug } });

    if (existing) {
      await prisma.product.update({ where: { slug }, data });
      updated++;
      console.log(`  ↻  [${data.category}] ${data.name}`);
    } else {
      await prisma.product.create({ data: data as Parameters<typeof prisma.product.create>[0]['data'] });
      created++;
      console.log(`  +  [${data.category}] ${data.name}`);
    }
  }

  console.log(`\n✅  Terminé — ${created} créés, ${updated} mis à jour.\n`);
}

main()
  .catch(err => { console.error(err); process.exit(1); })
  .finally(() => prisma.$disconnect());
