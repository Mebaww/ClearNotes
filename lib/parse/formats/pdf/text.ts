import type { PDFDocumentProxy, TextContent, TextItem } from "pdfjs-dist/types/src/display/api";
import type { PdfTextToken } from "./types";

function isTextItem(item: TextContent["items"][number]): item is TextItem {
  return "str" in item;
}

function normalizeExtractedText(text: string): string | null {
  const cleaned = text
    .replace(/\u00a0/g, " ")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return null;

  return cleaned;
}

export async function extractPdfTokens(pdfDocument: PDFDocumentProxy): Promise<PdfTextToken[]> {
  const pdfTokens: PdfTextToken[] = [];

  for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
    const page = await pdfDocument.getPage(pageNumber);
    const textContent = await page.getTextContent();

    textContent.items.forEach((item) => {
      if (!isTextItem(item)) return;
      if (!item.str || item.str.trim() === "") return;

      const normalizedText = normalizeExtractedText(item.str);
      if (!normalizedText) return;

      pdfTokens.push({
        text: normalizedText,
        x: item.transform[4],
        y: item.transform[5],
        w: item.width,
        fontSize: item.transform[3],
        page: pageNumber,
      });
    });
  }

  return pdfTokens;
}