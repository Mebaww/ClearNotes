export interface PdfTextToken {
  text: string;
  x: number;
  y: number;
  w: number;
  fontSize: number;
  page: number;
}

export interface ParsedPage {
  page: number;
  content: string;
}

export interface ParsedDocument {
  pageCount: number;
  pages: ParsedPage[];
}