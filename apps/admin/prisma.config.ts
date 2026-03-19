// prisma.config.ts
import * as dotenv from "dotenv";
import path from "path";
import { defineConfig } from "prisma/config";

// ✅ Chemin absolu depuis l'emplacement de ce fichier
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"]!,
  },
});