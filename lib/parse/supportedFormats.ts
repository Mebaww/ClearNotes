import type { DocumentFormat } from "./types";

export interface SupportedFormat {
  format: DocumentFormat;
  label: string;
  mimeTypes: string[];
  extensions: string[];
}

export const SUPPORTED_FORMATS: SupportedFormat[] = [
  {
    format: "pdf",
    label: "PDF",
    mimeTypes: ["application/pdf"],
    extensions: [".pdf"],
  },
  {
    format: "docx",
    label: "Word Document (.docx)",
    mimeTypes: [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ],
    extensions: [".docx"],
  },
  {
    format: "doc",
    label: "Legacy Word Document (.doc)",
    mimeTypes: ["application/msword"],
    extensions: [".doc"],
  },
  {
    format: "pptx",
    label: "PowerPoint (.pptx)",
    mimeTypes: [
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
    extensions: [".pptx"],
  },
];

export const ACCEPT_STRING = SUPPORTED_FORMATS.flatMap((f) => f.extensions).join(",");

const ALL_MIME_TYPES = new Set(SUPPORTED_FORMATS.flatMap((f) => f.mimeTypes));
const ALL_EXTENSIONS = new Set(SUPPORTED_FORMATS.flatMap((f) => f.extensions.map((e) => e.toLowerCase())));

export function isSupportedFile(file: File): boolean {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  // Check both MIME type and extension since browser MIME detection can be unreliable
  return ALL_MIME_TYPES.has(file.type) || ALL_EXTENSIONS.has(ext);
}

export const SUPPORTED_LABELS = SUPPORTED_FORMATS.map((f) => f.label).join(", ");

export function detectFormat(fileName: string, mimeType: string): DocumentFormat | null {
  const ext = "." + fileName.split(".").pop()?.toLowerCase();
  const match = SUPPORTED_FORMATS.find(
    (f) => f.mimeTypes.includes(mimeType) || f.extensions.includes(ext)
  );
  return match ? match.format : null;
}
