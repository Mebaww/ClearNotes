import { z } from "zod";

const envSchema = z.object({
  // Public Client / App URLs
  NEXT_PUBLIC_APP_URL: z
    .string()
    .min(1, "NEXT_PUBLIC_APP_URL is required")
    .url("NEXT_PUBLIC_APP_URL must be a valid URL (e.g. http://localhost:3000 or https://yourdomain.com)"),
  NEXT_PUBLIC_GA_ID: z.string().optional(),

  // Database
  DB_URL_DEV: z
    .string()
    .min(1, "DB_URL_DEV is required"),

  // Auth & API Keys
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_API_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // AI Services
  GEMINI_API_KEY: z.string().optional(),
});


export function validateEnv() {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
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

  return result.data;
}

export const env = validateEnv();
