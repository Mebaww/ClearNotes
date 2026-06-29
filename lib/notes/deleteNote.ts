import "server-only";
import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";


export async function deleteNote(id: string, userId: string) {
  const result = await prisma.note.deleteMany({
    where: { id, userId },
  });
  
  if (result.count === 0) {
    throw new AppError(
      "INVALID_DOCUMENT",
      "Note not found or you do not have permission to delete it."
    );
  }
}

