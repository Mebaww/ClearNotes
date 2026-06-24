import "server-only";
import { prisma } from "@/lib/prisma";
import { resolveUTMSource } from "@/lib/utm";

/**
 * Upserts a waitlist entry for the given email.
 * If the email already exists, the record is left unchanged.
 * Returns the created or existing waitlist record.
 */
export async function joinWaitlist(email: string, source?: string) {
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedSource = resolveUTMSource(source);

  return prisma.waitlist.upsert({
    where: { email: normalizedEmail },
    update: {},
    create: {
      email: normalizedEmail,
      source: normalizedSource,
    },
  });
}
