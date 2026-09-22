import "server-only";
import { prisma } from "@/lib/prisma";
import { AppError } from "../errors";

export async function updateNoteFolder(
  noteId: string,
  folderId: string | null,
  userId: string
) {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId },
  });

  if (!note) {
    throw new AppError("INVALID_REQUEST", "Note not found.");
  }

  if (folderId) {
    const folder = await prisma.folder.findFirst({
      where: { id: folderId, userId },
    });

    if (!folder) {
      throw new AppError("INVALID_REQUEST", "Folder not found.");
    }
  }

  return prisma.note.update({
    where: { id: noteId },
    data: { folderId },
    include: { folder: true },
  });
}
