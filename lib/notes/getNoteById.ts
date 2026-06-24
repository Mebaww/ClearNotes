import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * Fetches a single note by its ID.
 * Returns null when the note does not exist.
 * Used by the [id] page Server Component.
 */
export async function getNoteById(id: string) {
  return prisma.note.findUnique({
    where: { id },
  });
}
