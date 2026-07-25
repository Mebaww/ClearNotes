import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { dash } from "@better-auth/infra";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    // Session lives for 30 days
    expiresIn: 60 * 60 * 24 * 30,
    // Silently extend the session if the user is active within the last 7 days
    updateAge: 60 * 60 * 24 * 7,
    // Keep freshAge at 1 day (used for sensitive operations)
    freshAge: 60 * 60 * 24,
  },
  plugins: [
    dash({
      apiKey: process.env.BETTER_AUTH_API_KEY,
    }),
  ],
});
