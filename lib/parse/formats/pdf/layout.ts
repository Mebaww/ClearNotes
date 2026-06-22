import type { ParsedPage, PdfTextToken } from "./types";

function medianFontSize(tokens: PdfTextToken[]): number {
  const sizes = tokens.map((t) => t.fontSize).sort((a, b) => a - b);
  const mid = Math.floor(sizes.length / 2);
  return sizes.length % 2 === 0 ? (sizes[mid - 1] + sizes[mid]) / 2 : sizes[mid];
}

interface TableDetectionResult {
  tables: string[];
  usedTokens: Set<PdfTextToken>;
}

function detectTablesOnPage(pageTokens: PdfTextToken[]): TableDetectionResult {
  const ROW_Y_TOLERANCE = 4;
  const ROW_GAP_LIMIT = 20;
  const COL_X_TOLERANCE = 20;
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

  const tableRowCandidates = yGroups.filter((g) => g.length >= MIN_COLS);
  const tables: string[] = [];
  const usedTokens = new Set<PdfTextToken>();

  if (tableRowCandidates.length < MIN_ROWS) return { tables, usedTokens };

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
        match.center = match.tokens.reduce((sum, currentToken) => sum + currentToken.x, 0) / match.tokens.length;
      } else {
        xClusters.push({ center: token.x, tokens: [token] });
      }
    }

    if (xClusters.length < MIN_COLS) continue;
    xClusters.sort((a, b) => a.center - b.center);

    const rows: string[] = region.map((rowTokens) => {
      const sortedRow = [...rowTokens].sort((a, b) => a.x - b.x);
      const cells = xClusters.map((col) => {
        const cell = sortedRow.find((t) => Math.abs(t.x - col.center) <= COL_X_TOLERANCE);
        return cell ? cell.text.trim() : "";
      });
      return cells.join("\t").replace(/\t+$/g, "");
    });

    tables.push(rows.join("\n"));
    allRegionTokens.forEach((token) => usedTokens.add(token));
  }

  return { tables, usedTokens };
}

export function buildPages(tokens: PdfTextToken[]): ParsedPage[] {
  const bodyFontSize = medianFontSize(tokens);
  const headingThreshold = bodyFontSize * 1.15;
  const pages: ParsedPage[] = [];

  const tokensByPage = tokens.reduce(
    (acc, token) => {
      if (!acc[token.page]) acc[token.page] = [];
      acc[token.page].push(token);
      return acc;
    },
    {} as Record<number, PdfTextToken[]>
  );

  Object.keys(tokensByPage).forEach((pageStr) => {
    const pageNumber = Number(pageStr);
    const pageTokens = tokensByPage[pageNumber];
    const pageLines: string[] = [];

    const { tables, usedTokens } = detectTablesOnPage(pageTokens);

    tables.forEach((table) => {
      pageLines.push("[TABLE]");
      pageLines.push(table);
      pageLines.push("[/TABLE]");
    });

    const remainingTokens = pageTokens.filter((token) => !usedTokens.has(token));
    const columns: { xStart: number; xEnd: number; items: PdfTextToken[] }[] = [];
    const sortedByX = [...remainingTokens].sort((a, b) => a.x - b.x);

    sortedByX.forEach((token) => {
      const match = columns.find(
        (column) =>
          Math.abs(column.xStart - token.x) < 20 ||
          (token.x >= column.xStart && token.x <= column.xEnd)
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
      column.items.sort((a, b) => b.y - a.y);

      let lineBuffer: string[] = [];
      let prevY = -1;
      let prevFontSize = -1;

      column.items.forEach((item, index) => {
        const isNewParagraph =
          prevY !== -1 &&
          (prevY - item.y > item.fontSize * 1.5 || Math.abs(prevFontSize - item.fontSize) > 2);

        const looksLikeHeading =
          /^\d+(\.\d+)*\.?\s+[A-Z]/.test(item.text) || (item.fontSize > headingThreshold && index === 0);

        if ((isNewParagraph || looksLikeHeading) && lineBuffer.length > 0) {
          pageLines.push(lineBuffer.join(" ").replace(/\s+/g, " "));
          lineBuffer = [];
        }

        lineBuffer.push(item.text);
        prevY = item.y;
        prevFontSize = item.fontSize;
      });

      if (lineBuffer.length > 0) {
        pageLines.push(lineBuffer.join(" ").replace(/\s+/g, " "));
      }
    });

    pages.push({ page: pageNumber, content: pageLines.join("\n").trim() });
  });

  return pages;
}