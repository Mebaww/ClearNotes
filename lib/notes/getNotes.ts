import "server-only";
import { prisma } from "@/lib/prisma";

export async function getNotes(userId: string, limit = 20) {
  return prisma.note.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}