import "server-only";
import { prisma } from "@/lib/prisma";


export async function deleteNote(id: string, userId: string) {
  const result = await prisma.note.deleteMany({
    where: { id, userId },
  });
  
  if (result.count === 0) {
    throw new Error("Unauthorized to delete this note or it does not exist");
  }
}
