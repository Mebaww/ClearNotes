export interface Folder {
  id: string;
  name: string;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  _count?: {
    notes: number;
  };
}

export interface Note {
  id: string;
  title: string | null;
  sourceText: string | null;
  generated: string | null;
  folderId: string | null;
  folder?: Folder | null;
  createdAt: Date;
  updatedAt: Date;
}