
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const databaseUrl = process.env.DB_URL_PREVIEW

if (!databaseUrl) {
  throw new Error("Database URL is not defined");
}

const pool = new Pool({
  connectionString: databaseUrl,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});