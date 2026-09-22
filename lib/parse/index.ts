import { detectFormat } from "./supportedFormats";
import type { ParsedDocument, DocumentFormat } from "./types";
import { ParseError } from "./formats/pdf/parser";

export { ParseError } from "./formats/pdf/parser";
export type { ParseErrorCode } from "./formats/pdf/parser";
export type { ParsedDocument, ParsedPage, DocumentFormat } from "./types";

export async function parseDocument(
  fileBuffer: ArrayBuffer,
  fileName: string,
  mimeType: string
): Promise<ParsedDocument> {
  const format: DocumentFormat | null = detectFormat(fileName, mimeType);

  if (!format) {
    throw new ParseError(
      "PARSE_FAILED",
      "Unsupported file format. Please upload a PDF, Word document, or PowerPoint presentation."
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
      // Legacy binary .doc is unsupported in browser runtime; requires OOXML (.docx) or PDF
      throw new ParseError(
        "PARSE_FAILED",
        "Legacy .doc files can't be parsed directly. Please re-save your file as .docx or export it as a PDF and upload again."
      );
    }

    case "pptx": {
      const { parsePptxDocument } = await import("./formats/pptx");
      return parsePptxDocument(fileBuffer);
    }

    default: {
      const _exhaustive: never = format;
      throw new ParseError("PARSE_FAILED", `No parser found for format: ${_exhaustive}`);
    }
  }
}
