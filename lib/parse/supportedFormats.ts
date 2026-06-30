
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
// Future formats to support:
  // {
  //   format: "pptx",
  //   label: "PowerPoint (.pptx)",
  //   mimeTypes: [
  //     "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  //   ],
  //   extensions: [".pptx"],
  // },
];

// All accepted file extensions joined by commas (used in file input helper)
export const ACCEPT_STRING = SUPPORTED_FORMATS.flatMap((f) => f.extensions).join(",");

const ALL_MIME_TYPES = new Set(SUPPORTED_FORMATS.flatMap((f) => f.mimeTypes));
const ALL_EXTENSIONS = new Set(SUPPORTED_FORMATS.flatMap((f) => f.extensions.map((e) => e.toLowerCase())));

// Checks if the file format is supported. We check both mime type and extension 
// because browsers sometimes fail to report the correct mime type.
export function isSupportedFile(file: File): boolean {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  return ALL_MIME_TYPES.has(file.type) || ALL_EXTENSIONS.has(ext);
}

// Comma-separated list of formats for display in the UI (e.g. "PDF, Word Document")
export const SUPPORTED_LABELS = SUPPORTED_FORMATS.map((f) => f.label).join(", ");

// Identifies the file format (pdf, docx, doc) from its name or mime type.
export function detectFormat(fileName: string, mimeType: string): DocumentFormat | null {
  const ext = "." + fileName.split(".").pop()?.toLowerCase();
  const match = SUPPORTED_FORMATS.find(
    (f) => f.mimeTypes.includes(mimeType) || f.extensions.includes(ext)
  );
  return match ? match.format : null;
}

