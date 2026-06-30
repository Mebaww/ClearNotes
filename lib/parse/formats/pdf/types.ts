// PdfTextToken is an internal PDF implementation detail — not part of the shared API
export interface PdfTextToken {
  text: string;
  x: number;
  y: number;
  w: number;
  fontSize: number;
  page: number;
}

// Re-export shared types so the rest of the pdf module can import from one place
export type { ParsedPage, ParsedDocument } from "../../types";