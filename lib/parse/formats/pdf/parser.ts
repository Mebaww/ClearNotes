import { buildPages } from "./layout";
import { extractPdfTokens } from "./text";
import type { ParsedDocument } from "./types";
import { USAGE } from "../../../usage/config";


export type ParseErrorCode = "SCANNED_PDF" | "PARSE_FAILED" | "PAGE_LIMIT_EXCEEDED";

export class ParseError extends Error {
  readonly code: ParseErrorCode;

  constructor(code: ParseErrorCode, message: string) {
    super(message);
    this.name = "ParseError";
    this.code = code;
  }
}


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

  if (pdfDocument.numPages > USAGE.MAX_PDF_PAGES) {
    throw new ParseError(
      "PAGE_LIMIT_EXCEEDED",
      `Your PDF has ${pdfDocument.numPages} pages — the limit is ${USAGE.MAX_PDF_PAGES}. Please upload a shorter document.`
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