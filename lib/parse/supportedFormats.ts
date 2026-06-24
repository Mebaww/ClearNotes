/**
 * Central registry of file formats that ClearNotes can parse.
 *
 * To add a new format in the future:
 * 1. Add an entry to SUPPORTED_FORMATS below.
 * 2. Implement the parser under /lib/parse/formats/<type>/
 * 3. Wire it into DocumentUploader's parsing step.
 */

export interface SupportedFormat {
  /** Human-readable label shown in the file input accept string and error messages */
  label: string;
  /** MIME types accepted for this format */
  mimeTypes: string[];
  /** File extensions accepted for this format (including the dot) */
  extensions: string[];
}

export const SUPPORTED_FORMATS: SupportedFormat[] = [
  {
    label: "PDF",
    mimeTypes: ["application/pdf"],
    extensions: [".pdf"],
  },
  // Future formats — uncomment and implement the parser:
  // {
  //   label: "Word Document",
  //   mimeTypes: [
  //     "application/msword",
  //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //   ],
  //   extensions: [".doc", ".docx"],
  // },
  // {
  //   label: "PowerPoint",
  //   mimeTypes: [
  //     "application/vnd.ms-powerpoint",
  //     "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  //   ],
  //   extensions: [".ppt", ".pptx"],
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
