import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * Returns the total note count and the 3 most recently created notes.
 * Used by both the workspace Server Component and the /api/stats route handler.
 */
export async function getStats() {
  const [count, recent] = await Promise.all([
    prisma.note.count(),
    prisma.note.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return { count, recent };
}
