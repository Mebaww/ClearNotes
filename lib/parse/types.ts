export type DocumentFormat = "pdf" | "docx" | "doc" | "pptx";

export interface ParsedPage {
  page: number;
  content: string;
}

export interface ParsedDocument {
  format: DocumentFormat;
  pageCount: number;
  pages: ParsedPage[];
}
