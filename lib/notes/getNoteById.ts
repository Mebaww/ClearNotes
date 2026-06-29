import "server-only";
import { prisma } from "@/lib/prisma";


export async function getNoteById(id: string, userId: string) {
  return prisma.note.findFirst({
    where: { id, userId },
  });
}
