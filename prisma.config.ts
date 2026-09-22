import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl =
  process.env.DEV_DB_URL ||
  process.env.MAIN_DB_URL ||
  process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
