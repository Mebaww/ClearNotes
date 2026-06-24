import "server-only";
import { prisma } from "@/lib/prisma";

export async function getNotes(limit = 20) {
  return prisma.note.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}