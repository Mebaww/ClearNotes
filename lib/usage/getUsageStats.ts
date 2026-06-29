import "server-only";
import { prisma } from "../prisma";
import { AppError } from "../errors";

/**
 * Retrieves the usage stats for the specified user.
 * Assumes the caller has already authenticated the user.
 */
export async function getUsageStats(userId: string) {
  if (!userId) {
    throw new AppError("UNAUTHORIZED", "User ID is required");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      monthlyCreditsUsed: true,
      usageResetAt: true,
    },
  });

  if (!user) {
    throw new AppError("INVALID_REQUEST", "User not found");
  }

  return {
    monthlyCreditsUsed: user.monthlyCreditsUsed,
    usageResetAt: user.usageResetAt,
  };
}
