import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * Deletes a note from the database.
 * Ready for future auth integration (e.g. checks note ownership by userId).
 */
export async function deleteNote(id: string, userId?: string) {
  // In the future, when auth is added:
  // if (userId) {
  //   const note = await prisma.note.findUnique({ where: { id } });
  //   if (!note || note.userId !== userId) {
  //     throw new Error("Unauthorized to delete this note");
  //   }
  // }
  
  return prisma.note.delete({
    where: { id },
  });
}
