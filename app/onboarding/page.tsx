"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Sparkles, Zap, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: FileText,
    headline: "Upload any document",
    description:
      "Drag in a PDF from class, work, or research. ClearNotes accepts anything: lecture slides, research papers, reports, you name it.",
    visual: (
      <div className="relative mx-auto w-fit">
        <div className="flex flex-col gap-2">
          {["Lecture_Slides.pdf", "Research_Paper.pdf", "Meeting_Notes.pdf"].map((name, i) => (
            <div
              key={name}
              className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 shadow-xs"
              style={{ opacity: 1 - i * 0.2, transform: `translateY(${i * 2}px)` }}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="size-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{name}</span>
              <span className="ml-auto text-xs text-muted-foreground">PDF</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Sparkles,
    headline: "No summaries. Just the signal.",
    description:
      "Most documents are 80% filler. ClearNotes reads through everything and keeps only what actually matters, structured and ready to use.",
    visual: (
      <div className="mx-auto max-w-sm rounded-xl border border-border bg-background p-5 shadow-xs">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-full bg-primary">
            <Sparkles className="size-3.5 text-white" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Generated Notes
          </span>
        </div>
        <div className="space-y-2.5">
          {[
            { width: "w-full" },
            { width: "w-4/5" },
            { width: "w-full" },
            { width: "w-3/5" },
          ].map((item, i) => (
            <div key={i} className="space-y-1">
              <div className="h-2 w-16 rounded-full bg-primary/20" />
              <div className={`h-2 ${item.width} rounded-full bg-muted`} />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Zap,
    headline: "Your notes, instantly ready",
    description:
      "Review and revisit your notes any time from your dashboard. Everything that matters, nothing that doesn't.",
    visual: (
      <div className="mx-auto max-w-sm rounded-xl border border-border bg-background p-5 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">My Notes</span>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            3 documents
          </span>
        </div>
        <div className="space-y-2">
          {[
            { title: "Lecture Slides", time: "2 min ago" },
            { title: "Research Paper", time: "Yesterday" },
            { title: "Meeting Notes", time: "3 days ago" },
          ].map((note) => (
            <div
              key={note.title}
              className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2.5"
            >
              <span className="text-sm font-medium text-foreground">{note.title}</span>
              <span className="text-xs text-muted-foreground">{note.time}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const router = useRouter();

  const isLast = step === steps.length - 1;
  const current = steps[step];
  const Icon = current.icon;

  const handleNext = () => {
    if (isLast) {
      router.push("/workspace");
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleSkip = () => {
    router.push("/workspace");
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-12">
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-[0.06] blur-3xl"
        style={{ background: "#B8863B" }}
      />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          {/* Progress dots inside card */}
          <div className="mb-7 flex items-center gap-2">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                aria-label={`Go to step ${i + 1}`}
              >
                <div
                  className="transition-all duration-300"
                  style={{
                    width: i === step ? 24 : 8,
                    height: 8,
                    borderRadius: 9999,
                    background: i === step ? "#B8863B" : i < step ? "#B8863B55" : "var(--muted)",
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
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              {current.headline}
            </h2>
          </div>

          {/* Description */}
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground">
            {current.description}
          </p>

          {/* Visual */}
          <div className="mb-8">{current.visual}</div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Skip for now
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-black shadow-sm transition-all duration-150 hover:bg-primary/90 hover:shadow-md active:scale-[0.97]"
            >
              {isLast ? (
                <>
                  Go to Workspace
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
