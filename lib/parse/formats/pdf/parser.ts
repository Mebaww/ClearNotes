import { buildPages } from "./layout";
import { extractPdfTokens } from "./text";
import type { ParsedDocument } from "./types";

export type ParseErrorCode = "SCANNED_PDF" | "PARSE_FAILED" | "PAGE_LIMIT_EXCEEDED";

export class ParseError extends Error {
  readonly code: ParseErrorCode;

  constructor(code: ParseErrorCode, message: string) {
    super(message);
    this.name = "ParseError";
    this.code = code;
  }
}

const PAGE_LIMIT = 20;

// Set the CDN worker once at module load time (browser only)
if (typeof window !== "undefined") {
  import("pdfjs-dist").then((lib) => {
    lib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${lib.version}/build/pdf.worker.min.mjs`;
  });
}

export async function parsePDFDocument(
  fileBuffer: ArrayBuffer
): Promise<ParsedDocument> {
  const pdfjsLib = await import("pdfjs-dist");

  const pdfDocument = await pdfjsLib.getDocument({ data: fileBuffer }).promise;

  if (pdfDocument.numPages > PAGE_LIMIT) {
    throw new ParseError(
      "PAGE_LIMIT_EXCEEDED",
      `Your PDF has ${pdfDocument.numPages} pages — the limit is ${PAGE_LIMIT}. Please upload a shorter document.`
    );
  }

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