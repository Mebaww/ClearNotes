
import { PrismaClient } from "@/prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const databaseUrl = process.env.DB_URL_MAIN;

if (!databaseUrl) {
  throw new Error(
    "[Missing Environment Variable] Database connection URL is missing. Please set DATABASE_URL, DB_URL_MAIN, or DB_URL_DEV in your .env file."
  );
}


const pool = new Pool({
  connectionString: databaseUrl,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
});