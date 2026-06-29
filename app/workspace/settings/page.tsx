import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { USAGE } from "@/lib/usage/config";
import { getUsageStats } from "@/lib/usage";
import { ThemeSelector } from "@/components/workspace/ThemeSelector";
import { CreditCard, Palette, Coins } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const dbUser = await getUsageStats(session.user.id);

  const creditsUsed = dbUser.monthlyCreditsUsed ?? 0;
  const totalCredits = USAGE.FREE_MONTHLY_CREDITS;
  const usagePercentage = Math.min(100, Math.round((creditsUsed / totalCredits) * 100));

  const resetDate = dbUser.usageResetAt
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dbUser.usageResetAt))
    : "Next month";

  return (
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Customize your workspace preferences and monitor account limits.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Theme Preferences */}
          <section className="rounded-xl border border-border/80 bg-card p-6 shadow-xs">
            <div className="space-y-0.5">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <Palette className="size-4 text-muted-foreground" />
                Theme Mode
              </h3>
              <p className="text-xs text-muted-foreground">
                Switch between light, dark, or system default themes.
              </p>
            </div>

            <hr className="my-6 border-border/60" />

            <ThemeSelector />
          </section>

          {/* Usage Limit Panel */}
          <section className="rounded-xl border border-border/80 bg-card p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-base font-semibold text-foreground">Usage Limit</h3>
                <p className="text-xs text-muted-foreground">
                  Monitor your monthly processing quota.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                Beta
              </span>
            </div>

            <hr className="my-6 border-border/60" />

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground flex items-center gap-2">
                  <CreditCard className="size-4 text-muted-foreground" />
                  Monthly Credits Used
                </span>
                <span className="text-muted-foreground">
                  <strong className="font-semibold text-foreground">{creditsUsed}</strong> / {totalCredits} credits
                </span>
              </div>

              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Your credits reset monthly. The next reset is scheduled on{" "}
                <strong className="font-medium text-foreground">{resetDate}</strong>.
              </p>

              {/* Footnote explaining why the limits are present without suggesting future monetization */}
              <div className="mt-4 flex gap-2.5 rounded-lg bg-muted/40 p-3.5 border border-border/40">
                <Coins className="size-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-normal">
                  <strong>Why is there a limit?</strong> Processing documents and generating structured notes using AI language models incurs backend computing costs. During this beta stage, these limits help us manage API overhead while keeping the service free and stable for everyone.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
