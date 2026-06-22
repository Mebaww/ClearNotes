"use client";

import axios from "axios";
import { FileUp } from "lucide-react";
import { useState } from "react";
import { ParsedDocument } from "@/lib/parse";

type ParseResponse = {
  success: true;
  document?: ParsedDocument;
  error?: {
    code: string;
    message: string;
  };
};
export function DocumentUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [document, setDocument] = useState<ParsedDocument | null>(null);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const { data } = await axios.post<ParseResponse>("/api/parse", formData);

      if (data.success && data.document) {
        setDocument(data.document);

        console.log(data.document);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data?.error?.message);
      }
    }
  };

  return (
    <section className="flex h-full flex-col rounded-xl border border-border/80 bg-card">
      <div className="border-b border-border/60 px-5 py-4">
        <h2 className="text-sm font-semibold text-foreground">New notes</h2>
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
          className="sr-only"
        />

        <div className="flex size-10 items-center justify-center rounded-full bg-background text-primary shadow-sm ring-1 ring-border/60 transition-transform group-hover:scale-105">
          <FileUp className="size-4" strokeWidth={2} />
        </div>

        <p className="mt-4 text-sm font-medium text-foreground">
          Drop a file here, or click to browse
        </p>

        <p className="mt-1.5 max-w-[220px] text-xs leading-relaxed text-muted-foreground">
          PDF, DOCX, or PPTX. Content is processed locally — originals
          aren&apos;t stored.
        </p>

        {file && <p className="mt-3 text-xs text-primary">{file.name}</p>}
      </label>
    </section>
  );
}
