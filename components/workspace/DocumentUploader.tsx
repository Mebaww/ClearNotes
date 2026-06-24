"use client";

import axios from "axios";
import { sileo } from "sileo";
import { FileUp } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  isSupportedFile,
  ACCEPT_STRING,
  SUPPORTED_LABELS,
} from "@/lib/parse/supportedFormats";



export function DocumentUploader() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    // Validate file type against the supported formats registry
    if (!isSupportedFile(selectedFile)) {
      sileo.error({
        title: "Unsupported file type",
        description: `Only ${SUPPORTED_LABELS} files are supported. Please upload a different file.`,
      });
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    setLoading(true);

    try {
      // 1. Client-side PDF Parsing
      let extractedText = "";
      try {
        const { parsePDFDocument, ParseError } = await import(
          "@/lib/parse/formats/pdf/parser"
        );
        const arrayBuffer = await selectedFile.arrayBuffer();
        const parsedDoc = await parsePDFDocument(arrayBuffer);
        
        extractedText = parsedDoc.pages.map((p) => p.content).join("\n\n");

        if (!extractedText || extractedText.trim().length < 20) {
           throw new Error("Empty document text could not be extracted.");
        }
      } catch (err: any) {
        console.error("PDF Parsing Error:", err);
        const isParseLimitError = err.name === "ParseError" && err.code === "PAGE_LIMIT_EXCEEDED";
        sileo.error({
          title: isParseLimitError ? "PDF too long" : "Upload failed",
          description: err.name === "ParseError"
            ? err.message
            : "We couldn't read that file. Make sure it's a valid, non-corrupted PDF.",
        });
        return;
      }

      // 2. Send extracted text to the API
      const data = await sileo.promise(
        axios.post("/api/notes", { text: extractedText }).then((r) => r.data),
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
            if (axios.isAxiosError(err)) {
              const apiError = err.response?.data?.error;
              const code: string | undefined = apiError?.code;

              if (
                err.response?.status === 503 ||
                code === "AI_OVERLOADED" ||
                apiError?.message?.toLowerCase().includes("overloaded") ||
                apiError?.message?.toLowerCase().includes("busy")
              ) {
                return {
                  title: "AI is busy right now",
                  description:
                    "Gemini is under high load. Wait a few seconds and try uploading again.",
                };
              }

              if (code === "TEXT_TOO_LONG") {
                return {
                  title: "Document too large",
                  description:
                    "Your document has too much text for the AI to process. Try uploading a shorter document or splitting it into sections.",
                };
              }
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
      e.target.value = "";
    }
  };

  return (
    <section className="flex h-full min-w-0 flex-col rounded-xl border border-border/80 bg-card overflow-hidden">
      <div className="border-b border-border/60 px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">
          New notes
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Upload a file and we&apos;ll generate structured notes.
        </p>
      </div>

      <label
        htmlFor="workspace-upload"
        className="group m-4 flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-4 py-8 text-center transition-colors hover:border-primary/30 hover:bg-primary/[0.03] overflow-hidden min-w-0"
      >
        <input
          id="workspace-upload"
          type="file"
          accept={ACCEPT_STRING}
          onChange={handleFileChange}
          disabled={loading}
          className="sr-only"
        />

        <div className="flex size-10 items-center justify-center rounded-full bg-background text-primary shadow-sm ring-1 ring-border/60">
          <FileUp className="size-4" strokeWidth={2} />
        </div>

        <p className="mt-4 text-sm font-medium text-foreground">
          {loading
            ? "Generating notes…"
            : "Drop a file here, or click to browse"}
        </p>

        {file && (
          <p className="mt-3 max-w-full truncate text-xs text-primary px-2">
            {loading
              ? `Processing ${file.name}…`
              : file.name}
          </p>
        )}
      </label>
    </section>
  );
}