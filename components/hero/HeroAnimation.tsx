"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle2, Sparkles, UploadCloud } from "lucide-react";

// Phase durations in ms
const UPLOAD_DURATION   = 3000;
const SCAN_DURATION     = 4000;
const NOTES_DURATION    = 6500;
const TOTAL             = UPLOAD_DURATION + SCAN_DURATION + NOTES_DURATION;

// Raw document lines — some are "signal", some are "noise"
const DOC_LINES = [
  { text: "Enterprise expansion grew 14% this quarter,", signal: true  },
  { text: "driven largely by adoption of automated", signal: true  },
  { text: "compliance tools across EMEA markets.", signal: true  },
  { text: "Total headcount as of September 30th is", signal: false },
  { text: "4,821 employees across 22 global offices.", signal: false },
  { text: "Three open risk items flagged by leadership", signal: true  },
  { text: "ahead of the Q4 planning cycle.", signal: true  },
  { text: "Catering budget for Q3 offsite: $14,200.", signal: false },
  { text: "Product timeline confirmed for Q1 launch.", signal: true  },
];

// Note content lines — mimic real NoteViewer markdown output
// Each line has a type and reveal step
const NOTE_LINES = [
  { type: "date",    content: "Sep 30, 2024" },
  { type: "folder",  content: "Business" },
  { type: "h2",      content: "Key Takeaways" },
  { type: "li",      content: "Enterprise expansion grew **14% this quarter**, driven by automated compliance adoption across EMEA." },
  { type: "li",      content: "Leadership flagged **three open risk items** ahead of the Q4 planning cycle." },
  { type: "li",      content: "Product timeline **confirmed for Q1 launch** — no blockers reported." },
  { type: "h2",      content: "Action Items" },
  { type: "li",      content: "Resolve all 3 risk items before Q4 planning closes." },
  { type: "li",      content: "Confirm Q1 launch timeline with engineering lead." },
] as const;

// Steps: header (date+folder), then each content line
const TOTAL_REVEAL = NOTE_LINES.length;

function renderBold(text: string) {
  // Split on **bold** markers and render <strong>
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <strong key={i} className="font-semibold text-foreground">{part}</strong>
      : <span key={i}>{part}</span>
  );
}

function UploadPhase({ progress }: { progress: number }) {
  const done = progress >= 100;
  // Smooth entrance
  const entryProgress = Math.min(1, progress / 15); // 0→1 over first 15%
  const cardOpacity = entryProgress;
  const cardY = (1 - entryProgress) * 16;

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-6 px-6 animate-in fade-in duration-500">

      {/* Soft radial glow behind everything */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full transition-all duration-1000"
        style={{
          width: done ? "180px" : "140px",
          height: done ? "180px" : "140px",
          background: done
            ? "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(184,134,59,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Upload icon — breathes gently */}
      <div
        className="relative z-10 flex items-center justify-center transition-all duration-700"
        style={{
          opacity: cardOpacity,
          transform: `translateY(${cardY}px)`,
        }}
      >
        <div className={`flex size-12 items-center justify-center rounded-2xl transition-all duration-700 ${
          done
            ? "bg-emerald-500/10 text-emerald-500"
            : "bg-primary/8 text-primary"
        }`}
          style={{
            animation: done ? "none" : "breathe 3s ease-in-out infinite",
          }}
        >
          {done ? (
            <CheckCircle2 className="size-6 animate-in zoom-in-50 duration-400" />
          ) : (
            <UploadCloud className="size-6" />
          )}
        </div>
      </div>

      {/* File card */}
      <div
        className="relative z-10 w-full max-w-[260px] transition-all duration-500"
        style={{
          opacity: cardOpacity,
          transform: `translateY(${cardY * 0.6}px)`,
        }}
      >
        <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm transition-all duration-500 ${
          done
            ? "border-emerald-500/20 bg-emerald-500/[0.03]"
            : "border-border bg-card"
        }`}>
          <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-all duration-500 ${
            done ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
          }`}>
            <FileText className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium text-foreground truncate">Q3_Report_2024.pdf</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {done ? "Ready" : "2.4 MB"}
            </p>
          </div>
          <span className={`text-[11px] font-semibold tabular-nums transition-colors duration-300 ${
            done ? "text-emerald-500" : "text-muted-foreground"
          }`}>
            {done ? "✓" : `${Math.min(100, Math.round(progress))}%`}
          </span>
        </div>

        {/* Progress bar — thin and elegant */}
        <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-muted/50">
          <div
            className="h-full rounded-full transition-all duration-200 ease-out"
            style={{
              width: `${Math.min(100, progress)}%`,
              background: done
                ? "#22c55e"
                : "var(--primary)",
              boxShadow: done
                ? "0 0 6px rgba(34,197,94,0.4)"
                : "0 0 6px rgba(184,134,59,0.3)",
            }}
          />
        </div>

        {/* Status text */}
        <p className={`mt-2.5 text-center text-[11px] font-medium transition-colors duration-500 ${
          done ? "text-emerald-500" : "text-muted-foreground"
        }`}>
          {done ? "Upload complete" : "Uploading…"}
        </p>
      </div>

      {/* Keyframe for the breathing effect */}
      <style jsx>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.06); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function ScanPhase({ scanPct }: { scanPct: number }) {
  return (
    <div className="flex flex-col h-full px-4 py-3 gap-2 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex items-center justify-between pb-2 border-b border-border/40">
        <div className="flex items-center gap-1.5">
          <FileText className="size-3 text-muted-foreground" />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Source Document</span>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-primary font-medium">
          <Sparkles className="size-3 animate-pulse" />
          Scanning…
        </div>
      </div>

      {/* Lines */}
      <div className="relative flex-1 space-y-1 overflow-hidden">
        {/* Laser */}
        {scanPct > 0 && scanPct < 98 && (
          <div
            className="absolute left-0 right-0 h-[1px] z-10 pointer-events-none"
            style={{
              top: `${scanPct}%`,
              background: "var(--primary)",
              boxShadow: "0 0 12px 3px #B8863B66, 0 0 2px 1px #B8863B"
            }}
          />
        )}
        {DOC_LINES.map((line, i) => {
          const linePct = (i / (DOC_LINES.length - 1)) * 100;
          const passed = scanPct > linePct + 5;
          return (
            <p
              key={i}
              className={`text-[11px] leading-relaxed transition-all duration-500 ${
                passed && !line.signal
                  ? "opacity-20 blur-[1.5px] line-through decoration-muted-foreground/40"
                  : passed && line.signal
                  ? "font-semibold text-foreground"
                  : "text-foreground/60"
              }`}
            >
              {passed && line.signal ? (
                <span
                  className="rounded px-0.5 transition-all duration-300"
                  style={{ background: "rgba(184,134,59,0.15)", borderBottom: "1px solid rgba(184,134,59,0.4)" }}
                >
                  {line.text}
                </span>
              ) : line.text}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function NotesPhase({ revealCount }: { revealCount: number }) {
  const done = revealCount >= TOTAL_REVEAL;
  const dateVisible    = revealCount > 0;
  const folderVisible  = revealCount > 1;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Note card — mimics the real rounded-xl border bg-card p-8 wrapper */}
      <div className="flex-1 overflow-y-auto scrollbar-none px-5 py-4 pb-8">
        {/* Date + folder row — matches NoteViewer header */}
        <div
          className="mb-3 flex items-center justify-between border-b border-border/40 pb-3 transition-all duration-400"
          style={{ opacity: dateVisible ? 1 : 0 }}
        >
          <p className="text-[10px] text-muted-foreground">
            {dateVisible ? "September 30, 2024" : ""}
          </p>
          <div
            className="transition-all duration-400"
            style={{ opacity: folderVisible ? 1 : 0, transform: folderVisible ? "scale(1)" : "scale(0.9)" }}
          >
            {folderVisible && (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2 py-0.5 text-[9px] font-medium text-secondary-foreground">
                <svg className="size-2.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                Business
              </span>
            )}
          </div>
        </div>

        {/* Markdown-style body — matches NoteViewer article rendering */}
        <div className="space-y-0">
          {NOTE_LINES.slice(2).map((line, i) => {
            const step = i + 2; // offset past date+folder
            const visible = revealCount > step;
            const transStyle = {
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(6px)",
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
            };

            if (line.type === "h2") {
              return (
                <h2
                  key={i}
                  className="mt-3 mb-1.5 border-b border-border pb-1 text-xs font-semibold text-foreground first:mt-0"
                  style={transStyle}
                >
                  {line.content}
                </h2>
              );
            }

            if (line.type === "li") {
              return (
                <div
                  key={i}
                  className="flex items-start gap-1.5 py-0.5 pl-3"
                  style={transStyle}
                >
                  <span className="mt-[6px] size-[3px] shrink-0 rounded-full bg-muted-foreground/60" />
                  <p className="text-[10.5px] leading-relaxed text-muted-foreground">
                    {renderBold(line.content)}
                  </p>
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* "Done" indicator at bottom */}
        {done && (
          <div className="mt-3 flex justify-center">
            <span className="text-[9px] font-semibold text-emerald-500 bg-emerald-500/8 px-2.5 py-0.5 rounded-full border border-emerald-500/15 animate-in fade-in duration-300">
              ✓ Notes ready
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function HeroAnimation() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => (t + 50) % TOTAL);
    }, 50);
    return () => clearInterval(id);
  }, []);

  const phase: "upload" | "scan" | "notes" =
    tick < UPLOAD_DURATION
      ? "upload"
      : tick < UPLOAD_DURATION + SCAN_DURATION
      ? "scan"
      : "notes";

  let uploadProgress = 100;
  let scanPct = 0;
  let noteReveal = 0;

  if (phase === "upload") {
    uploadProgress = (tick / UPLOAD_DURATION) * 100;
    scanPct = 0;
    noteReveal = 0;
  } else if (phase === "scan") {
    uploadProgress = 100;
    const elapsed = tick - UPLOAD_DURATION;
    scanPct = (elapsed / SCAN_DURATION) * 100;
    noteReveal = 0;
  } else {
    uploadProgress = 100;
    scanPct = 100;
    const elapsed = tick - UPLOAD_DURATION - SCAN_DURATION;
    const fraction = elapsed / NOTES_DURATION;
    const revealFraction = Math.min(1, fraction / 0.8);
    const easedReveal = revealFraction * revealFraction;
    noteReveal = Math.floor(easedReveal * (TOTAL_REVEAL + 1));
  }

  const phaseLabel =
    phase === "upload" ? "Uploading document…"
    : phase === "scan" ? "AI scanning for signal…"
    : "Notes generated";

  const phaseStep = phase === "upload" ? 0 : phase === "scan" ? 1 : 2;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] backdrop-blur-2xl dark:bg-card/80 dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3 dark:bg-card/40">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#FF5F57]" />
          <span className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
          <span className="h-3 w-3 rounded-full bg-[#28C840]" />
        </div>
        <p className="flex-1 text-center text-xs font-medium text-muted-foreground">ClearNotes</p>
      </div>

      {/* Phase pills */}
      <div className="flex items-center gap-1.5 border-b border-border/40 px-4 py-2.5 bg-muted/10">
        {["Upload", "Scan", "Notes"].map((label, i) => (
          <div
            key={label}
            className="flex items-center gap-1.5"
          >
            <div
              className={`flex h-5 items-center gap-1 rounded-full px-2 text-[9px] font-semibold transition-all duration-300 ${
                i === phaseStep
                  ? "bg-primary/15 text-primary ring-1 ring-primary/25"
                  : i < phaseStep
                  ? "text-emerald-500 bg-emerald-500/10"
                  : "text-muted-foreground/50 bg-muted/30"
              }`}
            >
              {i < phaseStep ? "✓" : `${i + 1}`} {label}
            </div>
            {i < 2 && <div className="h-px w-2 bg-border/60" />}
          </div>
        ))}
        <div className="ml-auto text-[9px] text-muted-foreground">{phaseLabel}</div>
      </div>

      {/* Content area — fixed height */}
      <div className="h-[300px]">
        {phase === "upload" && <UploadPhase progress={uploadProgress} />}
        {phase === "scan"   && <ScanPhase scanPct={scanPct} />}
        {phase === "notes"  && <NotesPhase revealCount={noteReveal} />}
      </div>
    </div>
  );
}
