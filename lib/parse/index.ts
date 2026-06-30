/**
 * Public API for document parsing.
 *
 * Consumers should only import from this file — never from a specific
 * `formats/<name>/` module. That keeps format-specific libraries out of
 * bundles that don't need them, and makes swapping implementations trivial.
 *
 * To add a new format:
 *  1. Add its entry to `supportedFormats.ts`.
 *  2. Create `formats/<format>/index.ts` that exports a `parse<Format>Document` function.
 *  3. Add a `case "<format>"` to the switch in `parseDocument` below.
 */

import { detectFormat } from "./supportedFormats";
import type { ParsedDocument, DocumentFormat } from "./types";
import { ParseError } from "./formats/pdf/parser";

// Re-export ParseError and its type from here so the rest of the app
// has one stable import path and never needs to reach into formats/* directly.
export { ParseError } from "./formats/pdf/parser";
export type { ParseErrorCode } from "./formats/pdf/parser";

// Re-export shared types
export type { ParsedDocument, ParsedPage, DocumentFormat } from "./types";

/**
 * Parses any supported document from an ArrayBuffer into a unified ParsedDocument.
 *
 * The correct parser is selected automatically based on the file name and
 * MIME type — callers don't need to know which library handles which format.
 */
export async function parseDocument(
  fileBuffer: ArrayBuffer,
  fileName: string,
  mimeType: string
): Promise<ParsedDocument> {
  const format: DocumentFormat | null = detectFormat(fileName, mimeType);

  if (!format) {
    throw new ParseError(
      "PARSE_FAILED",
      "Unsupported file format. Please upload a PDF or Word document."
    );
  }


  switch (format) {
    case "pdf": {
      const { parsePDFDocument } = await import("./formats/pdf/parser");
      return parsePDFDocument(fileBuffer);
    }

    case "docx": {
      const { parseDocxDocument } = await import("./formats/docx");
      return parseDocxDocument(fileBuffer);
    }

    case "doc": {
      // Legacy .doc files are a proprietary binary format with no reliable
      // client-side parser. Ask the user to convert first.
      throw new ParseError(
        "PARSE_FAILED",
        "Legacy .doc files can't be parsed directly. Please re-save your file as .docx or export it as a PDF and upload again."
      );
    }

    default: {
      // This should never happen because detectFormat only returns values
      // present in SUPPORTED_FORMATS, but TypeScript needs the exhaustive check.
      const _exhaustive: never = format;
      throw new ParseError("PARSE_FAILED", `No parser found for format: ${_exhaustive}`);
    }
  }
}
