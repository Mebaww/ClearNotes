import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/prisma/generated/prisma/client";

export async function getNotes(userId: string, limit = 20, folderId?: string | null) {
  const where: Prisma.NoteWhereInput = { userId };

  if (folderId === "uncategorized") {
    where.folderId = null;
  } else if (folderId) {
    where.folderId = folderId;
  }

  return prisma.note.findMany({
    where,
    include: {
      folder: true,
      share: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}