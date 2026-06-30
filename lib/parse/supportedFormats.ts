/**
 * Central registry of file formats that ClearNotes can parse.
 *
 * To add a new format in the future:
 * 1. Add an entry to SUPPORTED_FORMATS below with its `format` key.
 * 2. Implement the parser under /lib/parse/formats/<format>/
 * 3. Wire the new case into the `parseDocument` dispatcher in lib/parse/index.ts.
 */
import type { DocumentFormat } from "./types";

export interface SupportedFormat {
  /** Machine-readable format key — must match the DocumentFormat union type */
  format: DocumentFormat;
  /** Human-readable label shown in the file input accept string and error messages */
  label: string;
  /** MIME types accepted for this format */
  mimeTypes: string[];
  /** File extensions accepted for this format (including the dot) */
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
  // Future formats — add an entry here and implement the parser:
  // {
  //   format: "pptx",
  //   label: "PowerPoint (.pptx)",
  //   mimeTypes: [
  //     "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  //   ],
  //   extensions: [".pptx"],
  // },
];

/** Flat list of all accepted extensions, used for the <input accept> attribute */
export const ACCEPT_STRING = SUPPORTED_FORMATS.flatMap((f) => f.extensions).join(",");

/** Flat list of all accepted MIME types */
const ALL_MIME_TYPES = new Set(SUPPORTED_FORMATS.flatMap((f) => f.mimeTypes));

/** Flat list of all accepted extensions (lower-cased) */
const ALL_EXTENSIONS = new Set(SUPPORTED_FORMATS.flatMap((f) => f.extensions.map((e) => e.toLowerCase())));

/**
 * Returns true if the given File matches a supported format.
 * Checks both MIME type and file extension for robustness,
 * because browsers sometimes report an empty MIME type for certain files.
 */
export function isSupportedFile(file: File): boolean {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();
  return ALL_MIME_TYPES.has(file.type) || ALL_EXTENSIONS.has(ext);
}

/** A comma-separated human-readable list of supported formats, e.g. "PDF" */
export const SUPPORTED_LABELS = SUPPORTED_FORMATS.map((f) => f.label).join(", ");

/**
 * Detects the DocumentFormat for a file based on its name and MIME type.
 * Returns null if the format is not supported.
 */
export function detectFormat(fileName: string, mimeType: string): DocumentFormat | null {
  const ext = "." + fileName.split(".").pop()?.toLowerCase();
  const match = SUPPORTED_FORMATS.find(
    (f) => f.mimeTypes.includes(mimeType) || f.extensions.includes(ext)
  );
  return match ? match.format : null;
}
