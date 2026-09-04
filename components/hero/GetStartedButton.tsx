"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";
import { useIsMounted } from "@/hooks/use-mounted";

interface GetStartedButtonProps {
  label?: string;
  className?: string;
  size?: "default" | "lg";
}

function Modal({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const handleNew = () => {
    onClose();
    router.push("/onboarding");
  };

  const handleReturning = () => {
    onClose();
    router.push("/auth");
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

      {/* Dialog */}
      <div
        className="relative z-10 w-full max-w-md"
        style={{ animation: "modal-in 0.18s cubic-bezier(0.16,1,0.3,1) both" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-xl shadow-black/10">
          <div className="p-7">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full text-muted-foreground/60 transition-all hover:bg-muted hover:text-foreground cursor-pointer"
            >
              <X className="size-3.5" />
            </button>

            {/* Header */}
            <div className="mb-7">
          
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Welcome to ClearNotes
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                Have you used ClearNotes before?
              </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
             
              <button
                onClick={handleNew}
                className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 text-left transition-all duration-200 hover:border-primary/40 hover:bg-primary/10 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div>
                    <p className="text-sm font-semibold text-foreground">I&apos;m new here</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Take me through the quick tour</p>
                  </div>
                </div>
                <ArrowRight className="size-4 shrink-0 text-primary/60 transition-transform duration-150 group-hover:translate-x-1 group-hover:text-primary" />
              </button>

              {/* Returning user — secondary */}
              <button
                onClick={handleReturning}
                className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 px-5 py-4 text-left transition-all duration-200 hover:bg-muted/60 hover:border-border/80 cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div>
                    <p className="text-sm font-semibold text-foreground">I have an account</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Sign in to my workspace</p>
                  </div>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform duration-150 group-hover:translate-x-1 group-hover:text-muted-foreground" />
              </button>
            </div>

            {/* Footer note */}
            <p className="mt-5 text-center text-[11px] text-muted-foreground/60">
              Free to use &mdash; no credit card required
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
      `}</style>
    </div>
  );
}

export function GetStartedButton({
  label = "Get Started",
  className = "",
}: GetStartedButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const mounted = useIsMounted();

  return (
    <>
      <button onClick={() => setModalOpen(true)} className={className}>
        {label}
      </button>

      {mounted && modalOpen &&
        createPortal(
          <Modal onClose={() => setModalOpen(false)} />,
          document.body
        )
      }
    </>
  );
}
