import "server-only";
import { prisma } from "../prisma";

export async function incrementUsage(userId: string, credits: number) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      monthlyCreditsUsed: {
        increment: credits, 
      },
    },
  });
}
