export interface FolderShare {
  id: string;
  folderId: string;
  token: string;
  enabled: boolean;
  viewCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Folder {
  id: string;
  name: string;
  userId: string;
  share?: FolderShare | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  _count?: {
    notes: number;
  };
}


export interface NoteShare {
  id: string;
  noteId: string;
  token: string;
  enabled: boolean;
  viewCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Note {

  id: string;
  title: string | null;
  sourceText: string | null;
  generated: string | null;
  folderId: string | null;
  folder?: Folder | null;
  share?: NoteShare | null;
  createdAt: Date;
  updatedAt: Date;
}