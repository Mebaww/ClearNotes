export interface Note {
  id: string;
  title: string | null;
  sourceText: string | null;
  generated: string | null;
  createdAt: Date;
  updatedAt: Date;
}