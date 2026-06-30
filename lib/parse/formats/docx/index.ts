import type { ParsedDocument } from "../../types";
// ParseError is imported from the pdf parser (not from ../../index) to avoid
// a circular dependency: index → docx → index.
import { ParseError } from "../pdf/parser";

export async function parseDocxDocument(
  fileBuffer: ArrayBuffer
): Promise<ParsedDocument> {
  const mammoth = await import("mammoth");

  const result = await mammoth.extractRawText({ arrayBuffer: fileBuffer });

  if (!result.value || result.value.trim().length === 0) {
    throw new ParseError(
      "PARSE_FAILED",
      "This Word document appears to be empty or could not be read. Please try uploading a different file."
    );
  }


  return {
    format: "docx",
    pageCount: 1,
    pages: [
      {
        page: 1,
        content: result.value.trim(),
      },
    ],
  };
}
