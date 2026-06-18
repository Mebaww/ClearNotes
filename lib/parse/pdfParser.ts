import { getDocument, GlobalWorkerOptions, version } from "pdfjs-dist/legacy/build/pdf.mjs";

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

// Raw text item extracted from a PDF page; x/y/fontSize are in PDF user units
interface PdfTextToken {
  text: string;
  x: number;
  y: number;
  w: number;
  fontSize: number; // transform[3] — vertical scale maps to rendered font size
  page: number;
}

// Internal tree node; always has arrays present to keep processing simple
interface DocumentSection {
  heading: string | null;
  level: number;
  blocks: ContentBlock[];
  children: DocumentSection[];
}

export interface TextBlock {
  type: "paragraph" | "list-item" | "heading";
  text: string;
  page: number;
}

// rows[i][j] is the cell at row i, column j; empty string = no content in that cell
export interface TableBlock {
  type: "table";
  rows: string[][];
  page: number;
}

export type ContentBlock = TextBlock | TableBlock;

// Output section — blocks and children are omitted when empty to keep the JSON lean
export interface ParsedSection {
  heading: string | null;
  level: number;
  blocks?: ContentBlock[];
  children?: ParsedSection[];
}

export interface ParsedDocument {
  pageCount: number;
  sectionCount: number;
  sections: ParsedSection[];
}

export async function parsePdf(fileBuffer: ArrayBuffer): Promise<ParsedDocument> {
  const loadingTask = getDocument({ data: fileBuffer });
  const pdfDocument = await loadingTask.promise;

  const pdfTokens: PdfTextToken[] = [];

  for (let i = 1; i <= pdfDocument.numPages; i++) {
    const page = await pdfDocument.getPage(i);
    const textContent = await page.getTextContent();

    textContent.items.forEach((item) => {
      if (!("str" in item) || !item.str || item.str.trim() === "") return;

      pdfTokens.push({
        text: item.str,
        x: item.transform[4],
        y: item.transform[5],
        w: item.width,
        fontSize: item.transform[3],
        page: i,
      });
    });
  }

  // No tokens after scanning all pages = image-based PDF with no text layer
  if (pdfTokens.length === 0) {
    throw new ParseError(
      "SCANNED_PDF",
      "This PDF has no text layer — it may be a scanned image. Try running it through OCR first."
    );
  }

  const rawTree = buildSectionTree(pdfTokens);
  const sections = compactSections(rawTree);

  return {
    pageCount: pdfDocument.numPages,
    sectionCount: countSections(sections),
    sections,
  };
}

// Strips the internal Root Document anchor and drops empty blocks/children arrays
function compactSections(sections: DocumentSection[]): ParsedSection[] {
  const result: ParsedSection[] = [];

  for (const section of sections) {
    if (section.heading === "Root Document") {
      result.push(...compactSections(section.children));
      continue;
    }

    const compact: ParsedSection = { heading: section.heading, level: section.level };
    if (section.blocks.length > 0) compact.blocks = section.blocks;
    if (section.children.length > 0) compact.children = compactSections(section.children);
    result.push(compact);
  }

  return result;
}

function countSections(sections: ParsedSection[]): number {
  return sections.reduce((n, s) => n + 1 + countSections(s.children ?? []), 0);
}

// Median is used instead of mean — large headings would skew the mean and throw off detection
function medianFontSize(tokens: PdfTextToken[]): number {
  const sizes = tokens.map((t) => t.fontSize).sort((a, b) => a - b);
  const mid = Math.floor(sizes.length / 2);
  return sizes.length % 2 === 0 ? (sizes[mid - 1] + sizes[mid]) / 2 : sizes[mid];
}

interface TableDetectionResult {
  tables: TableBlock[];
  usedTokens: Set<PdfTextToken>;
}

// Finds tables by looking for grids of tokens with consistent X and Y alignment.
// Any tokens claimed by a table are removed from the regular paragraph pass.
function detectTablesOnPage(pageTokens: PdfTextToken[], pageNum: number): TableDetectionResult {
  const ROW_Y_TOLERANCE = 4;   // tokens within 4pt vertically = same row
  const ROW_GAP_LIMIT = 20;    // gap larger than 20pt = start of a new table
  const COL_X_TOLERANCE = 20;  // tokens within 20pt horizontally = same column
  const MIN_COLS = 2;
  const MIN_ROWS = 2;

  const yGroups: PdfTextToken[][] = [];
  const sortedByY = [...pageTokens].sort((a, b) => b.y - a.y);

  for (const token of sortedByY) {
    const existing = yGroups.find((g) => Math.abs(g[0].y - token.y) <= ROW_Y_TOLERANCE);
    if (existing) {
      existing.push(token);
    } else {
      yGroups.push([token]);
    }
  }

  // A row with only one token is almost certainly a paragraph line, not a table row
  const tableRowCandidates = yGroups.filter((g) => g.length >= MIN_COLS);

  const tables: TableBlock[] = [];
  const usedTokens = new Set<PdfTextToken>();

  if (tableRowCandidates.length < MIN_ROWS) return { tables, usedTokens };

  // Group consecutive row candidates into table regions
  tableRowCandidates.sort((a, b) => b[0].y - a[0].y);
  const tableRegions: PdfTextToken[][][] = [];
  let currentRegion: PdfTextToken[][] = [tableRowCandidates[0]];

  for (let i = 1; i < tableRowCandidates.length; i++) {
    const prevY = currentRegion[currentRegion.length - 1][0].y;
    const currY = tableRowCandidates[i][0].y;
    if (Math.abs(prevY - currY) <= ROW_GAP_LIMIT) {
      currentRegion.push(tableRowCandidates[i]);
    } else {
      if (currentRegion.length >= MIN_ROWS) tableRegions.push(currentRegion);
      currentRegion = [tableRowCandidates[i]];
    }
  }
  if (currentRegion.length >= MIN_ROWS) tableRegions.push(currentRegion);

  for (const region of tableRegions) {
    const allRegionTokens = region.flat();

    const xClusters: { center: number; tokens: PdfTextToken[] }[] = [];
    for (const token of allRegionTokens) {
      const match = xClusters.find((c) => Math.abs(c.center - token.x) <= COL_X_TOLERANCE);
      if (match) {
        match.tokens.push(token);
        // Keep center as a running average so it stays accurate as more tokens are added
        match.center = match.tokens.reduce((s, t) => s + t.x, 0) / match.tokens.length;
      } else {
        xClusters.push({ center: token.x, tokens: [token] });
      }
    }

    if (xClusters.length < MIN_COLS) continue;
    xClusters.sort((a, b) => a.center - b.center);

    const rows: string[][] = region.map((rowTokens) => {
      const sortedRow = [...rowTokens].sort((a, b) => a.x - b.x);
      return xClusters.map((col) => {
        const cell = sortedRow.find((t) => Math.abs(t.x - col.center) <= COL_X_TOLERANCE);
        return cell ? cell.text.trim() : "";
      });
    });

    tables.push({ type: "table", rows, page: pageNum });
    allRegionTokens.forEach((t) => usedTokens.add(t));
  }

  return { tables, usedTokens };
}

// PDFs have no semantic structure, so we infer headings and layout from font size and position
function buildSectionTree(tokens: PdfTextToken[]): DocumentSection[] {
  const bodyFontSize = medianFontSize(tokens);
  const headingThreshold = bodyFontSize * 1.15;  // 15% above body = heading
  const topLevelThreshold = bodyFontSize * 1.4;  // 40% above body = top-level section

  const sectionTree: DocumentSection[] = [
    { heading: "Root Document", level: 1, blocks: [], children: [] },
  ];

  // Group tokens by page so column detection runs per-page, not across the whole doc
  const tokensByPage = tokens.reduce(
    (acc, token) => {
      if (!acc[token.page]) acc[token.page] = [];
      acc[token.page].push(token);
      return acc;
    },
    {} as Record<number, PdfTextToken[]>
  );

  Object.keys(tokensByPage).forEach((pageStr) => {
    const pageNum = Number(pageStr);
    const pageTokens = tokensByPage[pageNum];

    const { tables, usedTokens } = detectTablesOnPage(pageTokens, pageNum);

    if (tables.length > 0) {
      const targetSection = sectionTree[sectionTree.length - 1] || sectionTree[0];
      const activeSection =
        targetSection.children[targetSection.children.length - 1] || targetSection;
      tables.forEach((table) => activeSection.blocks.push(table));
    }

    const remainingTokens = pageTokens.filter((t) => !usedTokens.has(t));

    // 20pt X tolerance for column clustering covers typical indentation variation
    const columns: { xStart: number; xEnd: number; items: PdfTextToken[] }[] = [];
    const sortedByX = [...remainingTokens].sort((a, b) => a.x - b.x);

    sortedByX.forEach((token) => {
      const match = columns.find(
        (col) =>
          Math.abs(col.xStart - token.x) < 20 ||
          (token.x >= col.xStart && token.x <= col.xEnd)
      );
      if (match) {
        match.items.push(token);
        match.xEnd = Math.max(match.xEnd, token.x + token.w);
      } else {
        columns.push({ xStart: token.x, xEnd: token.x + token.w, items: [token] });
      }
    });

    columns.sort((a, b) => a.xStart - b.xStart);

    columns.forEach((column) => {
      // PDF y-axis points upward, so we sort descending to get top-to-bottom order
      column.items.sort((a, b) => b.y - a.y);

      let lineBuffer: string[] = [];
      let prevY = -1;
      let prevFontSize = -1;

      column.items.forEach((item, idx) => {
        const trimmedText = item.text.trim();

        // New paragraph if there's a big vertical gap or a noticeable font size change
        const isNewParagraph =
          prevY !== -1 &&
          (prevY - item.y > item.fontSize * 1.5 || Math.abs(prevFontSize - item.fontSize) > 2);

        // Heading: numbered pattern like "2.1 Title", or a larger-than-body font at the top of a column
        const looksLikeHeading =
          /^\d+(\.\d+)*\.?\s+[A-Z]/.test(trimmedText) ||
          (item.fontSize > headingThreshold && idx === 0);

        if ((isNewParagraph || looksLikeHeading) && lineBuffer.length > 0) {
          const flushedText = lineBuffer.join(" ").replace(/\s+/g, " ");
          appendBlockToSection(flushedText, prevFontSize, pageNum, sectionTree, headingThreshold, topLevelThreshold);
          lineBuffer = [];
        }

        lineBuffer.push(trimmedText);
        prevY = item.y;
        prevFontSize = item.fontSize;
      });

      if (lineBuffer.length > 0) {
        appendBlockToSection(
          lineBuffer.join(" "), prevFontSize, pageNum,
          sectionTree, headingThreshold, topLevelThreshold
        );
      }
    });
  });

  return sectionTree;
}

// Places a block of text into the right section of the tree.
// Headings create a new section; everything else goes into the deepest active section.
function appendBlockToSection(
  text: string,
  fontSize: number,
  page: number,
  root: DocumentSection[],
  headingThreshold: number,
  topLevelThreshold: number
) {
  const isHeading = /^\d+(\.\d+)*\.?\s+[A-Z]/.test(text) || fontSize > headingThreshold;

  if (isHeading) {
    const newSection: DocumentSection = {
      heading: text,
      level: fontSize > topLevelThreshold ? 2 : 3,
      blocks: [],
      children: [],
    };

    if (newSection.level === 2) {
      root.push(newSection);
    } else {
      const lastMainSection = root[root.length - 1] || root[0];
      lastMainSection.children.push(newSection);
    }
  } else {
    // Prefer the deepest active subsection; fall back to the last top-level section
    const targetSection = root[root.length - 1] || root[0];
    const activeSection =
      targetSection.children[targetSection.children.length - 1] || targetSection;

    activeSection.blocks.push({
      type: text.startsWith("•") || text.startsWith("-") ? "list-item" : "paragraph",
      text,
      page,
    });
  }
}
