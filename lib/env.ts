import { z } from "zod";

const envSchema = z
  .object({
    NEXT_PUBLIC_APP_URL: z
      .string()
      .url()
      .default("http://localhost:3000"),
    NEXT_PUBLIC_GA_ID: z.string().optional(),

    DATABASE_URL: z.string().optional(),
    DB_URL_MAIN: z.string().optional(),
    DB_URL_DEV: z.string().optional(),

    BETTER_AUTH_SECRET: z.string().optional(),
    BETTER_AUTH_URL: z.string().optional(),
    BETTER_AUTH_API_KEY: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    GEMINI_API_KEY: z.string().optional(),
    GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  })
  .refine(
    (data) => Boolean(data.DATABASE_URL || data.DB_URL_MAIN || data.DB_URL_DEV),
    {
      message:
        "Database connection URL is missing. Please set DATABASE_URL in your .env file.",
      path: ["DATABASE_URL"],
    }
  );

export function validateEnv() {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    DATABASE_URL: process.env.DATABASE_URL,
    DB_URL_MAIN: process.env.DB_URL_MAIN,
    DB_URL_DEV: process.env.DB_URL_DEV,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    BETTER_AUTH_API_KEY: process.env.BETTER_AUTH_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GEMINI_MODEL: process.env.GEMINI_MODEL,
  });

  if (!result.success) {
    const details = result.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join(" | ");
    throw new Error(`Environment Variable Validation Error: ${details}`);
  }

  const activeDatabaseUrl =
    result.data.DATABASE_URL ||
    result.data.DB_URL_MAIN ||
    result.data.DB_URL_DEV!;

  return {
    ...result.data,
    activeDatabaseUrl,
  };
}
