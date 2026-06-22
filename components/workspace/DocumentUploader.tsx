"use client";

import axios from "axios";
import { FileUp } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);

      const { data } = await axios.post("/api/notes", formData);

      if (data.success && data.noteId) {
        router.push(`workspace/notes/${data.noteId}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data?.error?.message);
      }
    } finally {
      setLoading(false);
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
            ? "Generating notes..."
            : "Drop a file here, or click to browse"}
        </p>

        {file && (
          <p className="mt-3 text-xs text-primary">
            {loading
              ? `Processing ${file.name}...`
              : file.name}
          </p>
        )}
      </label>
    </section>
  );
}