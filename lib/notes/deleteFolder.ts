import "server-only";
import { prisma } from "@/lib/prisma";
import { AppError } from "../errors";

export async function deleteFolder(folderId: string, userId: string) {
  const folder = await prisma.folder.findFirst({
    where: { id: folderId, userId },
  });

  if (!folder) {
    throw new AppError("INVALID_REQUEST", "Folder not found or not owned by you.");
  }

  // Delete the folder. Due to onDelete: SetNull, notes will remain and become uncategorized.
  await prisma.folder.delete({
    where: { id: folderId },
  });

  return true;
}
