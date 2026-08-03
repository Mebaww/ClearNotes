"use client";

import axios from "axios";
import { sileo } from "sileo";
import { FileUp, Loader2, BookOpen, GraduationCap, FileText } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  isSupportedFile,
  ACCEPT_STRING,
  SUPPORTED_LABELS,
} from "@/lib/parse/supportedFormats";
import { NoteStyle } from "@/types/note";

export function DocumentUploader() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [noteStyle, setNoteStyle] = useState<NoteStyle>("standard");

  const processFile = async (selectedFile: File) => {
    // Validate file type against the supported formats registry
    if (!isSupportedFile(selectedFile)) {
      sileo.error({
        title: "Unsupported file type",
        description: `Only ${SUPPORTED_LABELS} files are supported. Please upload a different file.`,
      });
      return;
    }

    setFile(selectedFile);
    setLoading(true);

    try {
      let extractedText = "";
      try {
        const { parseDocument, ParseError } = await import("@/lib/parse");
        const arrayBuffer = await selectedFile.arrayBuffer();
        const parsedDoc = await parseDocument(
          arrayBuffer,
          selectedFile.name,
          selectedFile.type
        );

        extractedText = parsedDoc.pages.map((p) => p.content).join("\n\n");

        if (!extractedText || extractedText.trim().length < 20) {
          throw new ParseError(
            "PARSE_FAILED",
            "Empty document text could not be extracted. Please upload a file with more content."
          );
        }
      } catch (err: any) {
        console.error("Document parsing error:", err);

        let title = "Upload failed";
        if (err.name === "ParseError") {
          if (err.code === "PAGE_LIMIT_EXCEEDED") title = "Document too long";
          else if (err.code === "SCANNED_PDF") title = "Scanned PDF detected";
        }

        sileo.error({
          title,
          description:
            err.name === "ParseError"
              ? err.message
              : "We couldn't read that file. Make sure it's a valid, non-corrupted document.",
        });
        // Reset loading so spinner doesn't stick on parse failure
        setLoading(false);
        setFile(null);
        return;
      }

      // Send extracted text to the API
      const data = await sileo.promise(
        axios.post("/api/notes", { text: extractedText, style: noteStyle }).then((r) => r.data),
        {
          loading: {
            title: "Generating notes…",
            description: `Processing ${selectedFile.name}`,
          },
          success: {
            title: "Notes ready!",
            description: "Your document has been converted to notes.",
          },
          error: (err: unknown) => {
            const apiError = axios.isAxiosError(err)
              ? err.response?.data?.error
              : undefined;

            const code = apiError?.code;
            const message = apiError?.message;

            const titleMap: Record<string, string> = {
              "AI_OVERLOADED": "AI is busy right now",
              "TEXT_TOO_LONG": "Document too large",
              "USAGE_LIMIT_EXCEEDED": "Monthly limit reached",
              "INVALID_REQUEST": "Invalid document"
            };

            if (code && message) {
              let description: React.ReactNode = message;

              if (code === "USAGE_LIMIT_EXCEEDED") {
                const parts = message.split(/reset on (.*?)\./);
                if (parts.length >= 2) {
                  description = (
                    <span className="flex flex-col gap-1.5 mt-1">
                      <span>You've used all your credits for this month.</span>
                      <span className="text-[0.8rem] text-muted-foreground">
                        Your limit will reset on{" "}
                        <strong className="inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold text-primary">
                          {parts[1]}
                        </strong>
                      </span>
                    </span>
                  );
                }
              }

              return {
                title: titleMap[code] || "Generation failed",
                description,
              };
            }

            return {
              title: "Generation failed",
              description: "An unexpected error occurred. Please try again.",
            };
          },
        }
      );

      if (data?.success && data?.noteId) {
        router.push(`/workspace/notes/${data.noteId}`);
      }
    } catch {
      // sileo.promise() re-throws on error
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!loading) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (loading) return;
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const stylesList: {
    id: NoteStyle;
    label: string;
    description: string;
    scenario: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: "standard",
      label: "Standard",
      description: "High-fidelity notes",
      scenario: "Good for any document — meetings, articles, books, guides & more",
      icon: FileText,
    },
    {
      id: "study",
      label: "Study",
      description: "Key terms, concepts & review Qs",
      scenario: "Best for studying — courses, lectures & learning material",
      icon: GraduationCap,
    },
    {
      id: "research",
      label: "Research",
      description: "Methodology, findings & evidence",
      scenario: "Best for academic papers, reports & technical docs",
      icon: BookOpen,
    },
  ];

  const selectedStyle = stylesList.find((s) => s.id === noteStyle)!;

  return (
    <section className="flex h-full min-w-0 flex-col rounded-xl border border-border/80 bg-card overflow-hidden transition-shadow">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-border/60 px-5 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">
            New notes
          </h2>
        </div>

        {/* Note Style Selector Pills */}
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted/60 p-1">
          {stylesList.map((s) => {
            const Icon = s.icon;
            const isSelected = noteStyle === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setNoteStyle(s.id)}
                disabled={loading}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-background text-primary shadow-xs ring-1 ring-border/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <Icon className="size-3.5 shrink-0" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected style scenario hint */}
        <p className="text-[11px] text-muted-foreground leading-snug">
          <span className="font-medium text-foreground">{selectedStyle.label}:</span>{" "}
          {selectedStyle.scenario}
        </p>
      </div>

      {/* Upload Drop Zone */}
      <div className="p-4 flex-1 flex flex-col">
        <label
          htmlFor="workspace-upload"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`group relative flex flex-1 min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200 overflow-hidden ${
            isDragOver
              ? "border-primary bg-primary/10 scale-[0.99]"
              : "border-border/80 bg-muted/20 hover:border-primary/40 hover:bg-primary/[0.02]"
          } ${loading ? "pointer-events-none opacity-80" : ""}`}
        >
          <input
            id="workspace-upload"
            type="file"
            accept={ACCEPT_STRING}
            onChange={handleFileChange}
            disabled={loading}
            className="sr-only"
          />

          <div
            className={`flex size-12 items-center justify-center rounded-2xl transition-transform duration-200 ${
              loading
                ? "bg-primary/10 text-primary"
                : "bg-background text-primary shadow-xs ring-1 ring-border/60 group-hover:scale-110"
            }`}
          >
            {loading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <FileUp className="size-5" strokeWidth={2} />
            )}
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-sm font-semibold text-foreground">
              {loading
                ? `Generating ${noteStyle} notes…`
                : isDragOver
                ? "Drop file to upload"
                : "Click to upload or drag & drop"}
            </p>
            <p className="text-xs text-muted-foreground">
              {SUPPORTED_LABELS} (up to 20MB)
            </p>
          </div>

          {file && (
            <div className="mt-4 flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary max-w-full">
              <span className="truncate max-w-[200px] sm:max-w-[300px]">
                {file.name}
              </span>
            </div>
          )}
        </label>
      </div>
    </section>
  );
}