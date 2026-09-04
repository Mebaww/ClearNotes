import "server-only";
import { resetUsageIfNeeded } from "./resetUsageIfNeeded";
import { USAGE } from "./config";
import { AppError } from "../errors";

export async function checkUsageLimit(userId: string, creditsNeeded: number) {
  const user = await resetUsageIfNeeded(userId);
  const remaining = USAGE.FREE_MONTHLY_CREDITS - user.monthlyCreditsUsed;

  if (remaining < creditsNeeded) {
    const resetDate = user.usageResetAt
      ? new Intl.DateTimeFormat("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }).format(user.usageResetAt)
      : "next month";

    throw new AppError(
      "USAGE_LIMIT_EXCEEDED",
      `You've used all your credits for this month. Your limit will reset on ${resetDate}.`
    );
  }

  return {
    allowed: true,
    remaining,
  };
}