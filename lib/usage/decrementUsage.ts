import "server-only";
import { prisma } from "../prisma";

/**
 * Decrements the user's monthlyCreditsUsed by the specified credits.
 * This is used as a rollback/refund mechanism if note generation fails.
 */
export async function decrementUsage(userId: string, credits: number) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      monthlyCreditsUsed: {
        decrement: credits,
      },
    },
  });
}
