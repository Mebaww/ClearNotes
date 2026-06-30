import type { ParsedDocument, ParsedPage } from "../../types";
// Import ParseError from the pdf parser directly to avoid circular imports.
import { ParseError } from "../pdf/parser";

// PowerPoint slides map naturally to pages, so each slide becomes a ParsedPage.
// We use JSZip to decompress the .pptx archive (it's just a zip file internally),
// then use the browser's built-in DOMParser to read the slide XML and pull out the text.
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

  // All text elements in a .pptx slide live under this XML namespace
  const DRAWING_NS = "http://schemas.openxmlformats.org/drawingml/2006/main";
  const parser = new DOMParser();
  const pages: ParsedPage[] = [];
  let slideIndex = 1;

  while (true) {
    const slideFile = zip.file(`ppt/slides/slide${slideIndex}.xml`);
    if (!slideFile) break; // no more slides

    const xmlText = await slideFile.async("text");
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    // Each <a:p> is a paragraph on the slide. We collect the text from all
    // its <a:t> (text run) children and combine them into one paragraph string.
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
