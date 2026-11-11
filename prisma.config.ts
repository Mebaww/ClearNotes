import "dotenv/config";
import { defineConfig } from "prisma/config";

// Migrations use the direct/session-mode connection when one is provided
// (required by poolers such as Neon or Supabase); otherwise they reuse
// DATABASE_URL.
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
