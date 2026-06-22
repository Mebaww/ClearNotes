import { getDocument, GlobalWorkerOptions, version } from "pdfjs-dist/legacy/build/pdf.mjs";
import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { buildPages } from "./layout";
import { extractPdfTokens } from "./text";
import type { ParsedDocument } from "./types";

// Set once at module load; guarded to avoid re-assigning across hot reloads
if (typeof globalThis !== "undefined" && !GlobalWorkerOptions.workerSrc) {
  GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`;
}

export type ParseErrorCode = "SCANNED_PDF" | "PARSE_FAILED";

export class ParseError extends Error {
  readonly code: ParseErrorCode;
  constructor(code: ParseErrorCode, message: string) {
    super(message);
    this.name = "ParseError";
    this.code = code;
  }
}

async function extractTokens(pdfDocument: PDFDocumentProxy) {
  return extractPdfTokens(pdfDocument);
}

export async function parsePDFDocument(fileBuffer: ArrayBuffer): Promise<ParsedDocument> {
  const loadingTask = getDocument({ data: fileBuffer });
  const pdfDocument = await loadingTask.promise;

  const pdfTokens = await extractTokens(pdfDocument);

  // No tokens after scanning all pages = image-based PDF with no text layer
  if (pdfTokens.length === 0) {
    throw new ParseError(
      "SCANNED_PDF",
      "This PDF has no text layer — it may be a scanned image. Try running it through OCR first."
    );
  }

  const pages = buildPages(pdfTokens);

  console.log(`Parsed PDF document with ${pdfDocument.numPages} pages and ${pdfTokens.length} tokens.`);
  return {
    pageCount: pdfDocument.numPages,
    pages,
  };
}