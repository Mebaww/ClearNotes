import type { ParsedDocument, ParsedPage } from "../../types";
import { ParseError } from "../pdf/parser";

const DRAWING_NS = "http://schemas.openxmlformats.org/drawingml/2006/main";

export async function parsePptxDocument(
  fileBuffer: ArrayBuffer
): Promise<ParsedDocument> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  try {
    await zip.loadAsync(fileBuffer);
  } catch {
    throw new ParseError(
      "PARSE_FAILED",
      "Couldn't open this PowerPoint file. Make sure it's a valid .pptx and try again."
    );
  }

  const parser = new DOMParser();
  const pages: ParsedPage[] = [];
  let slideIndex = 1;

  while (true) {
    const slideFile = zip.file(`ppt/slides/slide${slideIndex}.xml`);
    if (!slideFile) break;

    const xmlText = await slideFile.async("text");
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    const paragraphs = xmlDoc.getElementsByTagNameNS(DRAWING_NS, "p");
    const slideLines: string[] = [];

    for (let i = 0; i < paragraphs.length; i++) {
      const textNodes = paragraphs[i].getElementsByTagNameNS(DRAWING_NS, "t");
      let paragraphText = "";

      for (let j = 0; j < textNodes.length; j++) {
        paragraphText += textNodes[j].textContent ?? "";
      }

      const cleaned = paragraphText.trim();
      if (cleaned) slideLines.push(cleaned);
    }

    pages.push({
      page: slideIndex,
      content: slideLines.join("\n"),
    });

    slideIndex++;
  }

  if (pages.length === 0) {
    throw new ParseError(
      "PARSE_FAILED",
      "No slides or text could be extracted from this PowerPoint presentation."
    );
  }

  return {
    format: "pptx",
    pageCount: pages.length,
    pages,
  };
}
