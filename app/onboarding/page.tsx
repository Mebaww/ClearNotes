"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Sparkles,
  Search,
  ArrowRight,
  Upload,
} from "lucide-react";

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const stepsList = [
    {
      icon: Upload,
      headline: "Upload any document",
      description: "ClearNotes accepts PDFs, slide decks, and Word documents. Just drop your file and let the AI do the heavy lifting.",
      visual: (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-8 text-center bg-muted/10 min-h-[160px]">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
            <Upload className="size-6" />
          </div>
          <p className="text-sm font-medium text-foreground">Drag and drop your PDF here</p>
          <p className="text-xs text-muted-foreground mt-1">Supports up to 20MB per file</p>
        </div>
      ),
    },
    {
      icon: Sparkles,
      headline: "Get clean, structured notes",
      description: "No more sifting through long pages. ClearNotes instantly extracts the core signal and organizes it into readable, actionable notes.",
      visual: (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 min-h-[160px]">
          <div className="flex items-center gap-2 border-b border-border/50 pb-3">
            <FileText className="size-4 text-primary" />
            <span className="text-sm font-semibold">Q3 Quarterly Report Notes</span>
          </div>
          <div className="space-y-2 mt-2">
            <div className="h-2 w-3/4 rounded-full bg-primary/20" />
            <div className="h-2 w-full rounded-full bg-muted" />
            <div className="h-2 w-5/6 rounded-full bg-muted" />
            <div className="h-2 w-4/6 rounded-full bg-muted" />
          </div>
        </div>
      ),
    },
    {
      icon: Search,
      headline: "Everything organized",
      description: "Save your notes into folders, search through your library in seconds, and stay perfectly organized.",
      visual: (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 min-h-[160px]">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2">
            <Search className="size-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Search "revenue growth"...</span>
          </div>
          <div className="flex gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">All</span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Business</span>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">Meetings</span>
          </div>
        </div>
      ),
    }
  ];

  const isLast = step === stepsList.length - 1;
  const current = stepsList[step];
  const Icon = current.icon;

  const handleNext = () => {
    if (isLast) {
      router.push("/auth");
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleSkip = () => {
    router.push("/auth");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="relative w-full max-w-xl animate-in fade-in zoom-in-95 duration-500">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          {/* Progress dots inside card */}
          <div className="mb-7 flex items-center gap-2">
            {stepsList.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                aria-label={`Go to step ${i + 1}`}
                className="cursor-pointer"
              >
                <div
                  className="transition-all duration-300"
                  style={{
                    width: i === step ? 24 : 8,
                    height: 8,
                    borderRadius: 9999,
                    background: i === step ? "var(--primary)" : i < step ? "var(--primary)" : "var(--muted)",
                    opacity: i === step ? 1 : i < step ? 0.5 : 1
                  }}
                />
              </button>
            ))}
          </div>

          {/* Icon + Headline */}
          <div className="mb-2 flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="size-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground text-left">
              {current.headline}
            </h2>
          </div>

          {/* Description */}
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground text-left">
            {current.description}
          </p>

          {/* Visual Container */}
          <div className="mb-8">{current.visual}</div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 border-t border-border/40 pt-6">
            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
            >
              Skip
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-150 hover:bg-primary/90 hover:shadow-md active:scale-[0.97] cursor-pointer"
            >
              {isLast ? (
                <>
                  Create Account
                  <ArrowRight className="size-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
