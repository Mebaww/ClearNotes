import { z } from "zod";

const envSchema = z
  .object({
    // Public Client / App URLs
    NEXT_PUBLIC_APP_URL: z
      .string()
      .min(1, "NEXT_PUBLIC_APP_URL is required")
      .url(
        "NEXT_PUBLIC_APP_URL must be a valid URL (e.g. http://localhost:3000 or https://yourdomain.com)"
      ),
    NEXT_PUBLIC_GA_ID: z.string().optional(),

    // Database connection options (at least one must be provided)
    DATABASE_URL: z.string().optional(),
    DB_URL_MAIN: z.string().optional(),
    DB_URL_DEV: z.string().optional(),

    // Auth & API Keys
    BETTER_AUTH_SECRET: z.string().optional(),
    BETTER_AUTH_API_KEY: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    // AI Services
    GEMINI_API_KEY: z.string().optional(),
  })
  .refine(
    (data) => Boolean(data.DATABASE_URL || data.DB_URL_MAIN || data.DB_URL_DEV),
    {
      message:
        "Database connection URL is missing. Please set DATABASE_URL, DB_URL_MAIN, or DB_URL_DEV in your environment (.env).",
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
    BETTER_AUTH_API_KEY: process.env.BETTER_AUTH_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  });

  if (!result.success) {
    console.error("❌ Invalid or Missing Environment Variables:");
    result.error.issues.forEach((issue) => {
      console.error(`   -> ${issue.path.join(".")}: ${issue.message}`);
    });
    throw new Error(
      `Environment Variable Validation Error: ${result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(" | ")}`
    );
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

export const env = validateEnv();

