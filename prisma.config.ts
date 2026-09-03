import "dotenv/config"
import { defineConfig } from "prisma/config"

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // Direct connection for migrations; the app uses DATABASE_URL (pooler) at runtime
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
})
