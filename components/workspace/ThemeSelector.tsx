"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMounted } from "@/hooks/use-mounted";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <div className="flex h-10 w-full animate-pulse rounded-lg bg-muted/60 md:w-80" />
    );
  }

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="inline-flex w-full rounded-lg border border-border/80 bg-muted/40 p-1 md:w-auto">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.value;

        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-medium transition-all outline-none md:flex-initial md:px-5",
              isActive
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
