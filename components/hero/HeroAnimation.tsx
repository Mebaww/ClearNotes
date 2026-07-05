"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle2, Sparkles, UploadCloud } from "lucide-react";

// Phase durations in ms
const UPLOAD_DURATION   = 3500;
const SCAN_DURATION     = 4500;
const NOTES_DURATION    = 5000;
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
  // Calculate a scale and translateY for a 'flying in' effect for the card
  const cardScale = Math.min(1, 0.95 + progress / 2000);
  const cardY = Math.max(0, 30 - progress * 0.3);
  const cardOpacity = Math.min(1, progress / 10);

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-5 px-4 animate-in fade-in duration-300">
      
      {/* Background dashed drop zone */}
      <div className="absolute inset-4 rounded-2xl border-2 border-dashed transition-all duration-500"
           style={{
             borderColor: done ? "rgba(34, 197, 94, 0.25)" : "rgba(184, 134, 59, 0.2)",
             backgroundColor: done ? "rgba(34, 197, 94, 0.03)" : "transparent",
             transform: done ? "scale(0.98)" : "scale(1)"
           }}
      />
      
      {/* Background pulsing circle when uploading */}
      {!done && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <div className="h-32 w-32 rounded-full border border-primary/20 bg-primary/5 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
         </div>
      )}

      {/* File card */}
      <div
        className="relative z-10 flex items-center gap-3.5 rounded-xl border border-border bg-card px-5 py-4 shadow-xl transition-all duration-300 w-full max-w-[260px]"
        style={{ transform: `translateY(${cardY}px) scale(${cardScale})`, opacity: cardOpacity }}
      >
        <div className={`relative flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-500 overflow-hidden ${done ? "bg-emerald-500/15 text-emerald-500 ring-1 ring-emerald-500/30" : "bg-primary/10 text-primary ring-1 ring-primary/20"}`}>
          {/* Progress fill inside icon box */}
          {!done && (
            <div className="absolute bottom-0 left-0 right-0 bg-primary/20 transition-all duration-150" style={{ height: `${progress}%` }} />
          )}
          {done
            ? <CheckCircle2 className="size-5 relative z-10 animate-in zoom-in" />
            : <FileText className="size-5 relative z-10" />
          }
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">Q3_Report_2024.pdf</p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[10px] text-muted-foreground font-medium">2.4 MB</p>
            {!done && (
               <>
                 <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                 <p className="text-[10px] text-primary font-medium animate-pulse">Uploading...</p>
               </>
            )}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 w-full max-w-[260px] space-y-1.5 transition-all duration-500" style={{ transform: `translateY(${cardY * 0.5}px)`, opacity: cardOpacity }}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1.5">
            {done ? <CheckCircle2 className="size-3 text-emerald-500" /> : <UploadCloud className="size-3 text-primary animate-bounce" />}
            {done ? "Upload complete" : "Transferring data"}
          </span>
          <span className="text-[10px] font-bold text-foreground">{Math.min(100, Math.round(progress))}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted/60 p-[1px]">
          <div
            className="h-full rounded-full transition-all duration-150 ease-out"
            style={{
              width: `${Math.min(100, progress)}%`,
              background: done ? "#22c55e" : "var(--primary)",
              boxShadow: done ? "0 0 8px #22c55e88" : "0 0 8px #B8863B66"
            }}
          />
        </div>
      </div>
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
  const [tick, setTick]       = useState(0);   // ms into current loop
  const [scanPct, setScanPct] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [noteReveal, setNoteReveal] = useState(0);

  // Drive the loop with a 50ms interval
  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => (t + 50) % TOTAL);
    }, 50);
    return () => clearInterval(id);
  }, []);

  // Derived phase & sub-progress from tick
  const phase: "upload" | "scan" | "notes" =
    tick < UPLOAD_DURATION               ? "upload"
    : tick < UPLOAD_DURATION + SCAN_DURATION ? "scan"
    : "notes";

  // Update smooth progress values on tick changes
  useEffect(() => {
    if (phase === "upload") {
      const p = (tick / UPLOAD_DURATION) * 100;
      setUploadProgress(p);
      setScanPct(0);
      setNoteReveal(0);
    } else if (phase === "scan") {
      const elapsed = tick - UPLOAD_DURATION;
      setScanPct((elapsed / SCAN_DURATION) * 100);
    } else {
      const elapsed = tick - UPLOAD_DURATION - SCAN_DURATION;
      const fraction = elapsed / NOTES_DURATION;
      setNoteReveal(Math.floor(fraction * (TOTAL_REVEAL + 1)));
      setScanPct(100);
    }
  }, [tick, phase]);

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
