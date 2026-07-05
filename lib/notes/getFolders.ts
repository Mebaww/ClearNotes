import "server-only";
import { prisma } from "@/lib/prisma";

export async function getFolders(userId: string) {
  return prisma.folder.findMany({
    where: { userId },
    include: {
      _count: {
        select: { notes: true },
      },
    },
    orderBy: { name: "asc" },
  });
}
