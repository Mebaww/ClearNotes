import "./polyfill";
import { buildPages } from "./layout";
import { extractPdfTokens } from "./text";
import type { ParsedDocument } from "./types";

export type ParseErrorCode = "SCANNED_PDF" | "PARSE_FAILED";

export class ParseError extends Error {
  readonly code: ParseErrorCode;

  constructor(code: ParseErrorCode, message: string) {
    super(message);
    this.name = "ParseError";
    this.code = code;
  }
}

export async function parsePDFDocument(
  fileBuffer: ArrayBuffer
): Promise<ParsedDocument> {
  const { getDocument } = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const pdfDocument = await getDocument({ data: fileBuffer }).promise;

  const pdfTokens = await extractPdfTokens(pdfDocument);

  if (pdfTokens.length === 0) {
    throw new ParseError(
      "SCANNED_PDF",
      "This PDF has no text layer — it may be a scanned image. Try running it through OCR first."
    );
  }

  const pages = buildPages(pdfTokens);

  return {
    pageCount: pdfDocument.numPages,
    pages,
  };
}