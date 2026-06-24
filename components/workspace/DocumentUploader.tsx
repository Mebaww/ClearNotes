"use client";

import axios from "axios";
import { sileo } from "sileo";
import { FileUp } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Maps server-side error codes to user-friendly toast messages
function getErrorMessage(code?: string): string {
  switch (code) {
    case "PAGE_LIMIT_EXCEEDED":
      return "Your PDF is too long. Please upload a document with 20 pages or fewer.";
    case "INVALID_FILE":
      return "That file doesn't look like a valid PDF. Please try a different file.";
    case "SCANNED_PDF":
      return "This PDF appears to be a scanned image with no text layer. Try running it through OCR first.";
    case "PARSE_FAILED":
      return "We couldn't read that file. Make sure it's a valid, non-corrupted PDF.";
    default:
      return "Something went wrong. Please try again in a moment.";
  }
}

export function DocumentUploader() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const data = await sileo.promise(
        axios.post("/api/notes", formData).then((r) => r.data),
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
            // Axios error — pull the structured error body from the API response
            if (axios.isAxiosError(err)) {
              const apiError = err.response?.data?.error;
              const code: string | undefined = apiError?.code;

              // Gemini quota / server overload
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

              return {
                title: "Upload failed",
                description: getErrorMessage(code),
              };
            }

            return {
              title: "Upload failed",
              description: "An unexpected error occurred. Please try again.",
            };
          },
        }
      );

      if (data?.success && data?.noteId) {
        router.push(`/workspace/notes/${data.noteId}`);
      }
    } catch {
      // sileo.promise() re-throws on error — errors are already shown as toasts above
    } finally {
      setLoading(false);
      // Reset the input so the same file can be re-uploaded after an error
      e.target.value = "";
    }
  };

  return (
    <section className="flex h-full flex-col rounded-xl border border-border/80 bg-card">
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
        className="group m-4 flex flex-1 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 px-5 py-10 text-center transition-colors hover:border-primary/30 hover:bg-primary/[0.03]"
      >
        <input
          id="workspace-upload"
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx"
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
          <p className="mt-3 text-xs text-primary">
            {loading
              ? `Processing ${file.name}…`
              : file.name}
          </p>
        )}
      </label>
    </section>
  );
}