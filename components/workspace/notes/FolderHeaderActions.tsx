"use client";

import { Folder as FolderIcon, Plus, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FolderHeaderActionsProps {
  selectedFolderId: string | null;
  activeFolderName: string;
  notesCount: number;
  onOpenAddNotesDialog: () => void;
  onRenameFolder: () => void;
  onDeleteFolder: (e: React.MouseEvent) => void;
}

export default function FolderHeaderActions({
  selectedFolderId,
  activeFolderName,
  notesCount,
  onOpenAddNotesDialog,
  onRenameFolder,
  onDeleteFolder,
}: FolderHeaderActionsProps) {
  const isCustomFolder = selectedFolderId && selectedFolderId !== "uncategorized";

  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-3">
      <div className="flex items-center gap-2">
        {isCustomFolder && <FolderIcon className="size-4 text-muted-foreground" />}
        <h2 className="text-sm font-semibold text-foreground">{activeFolderName}</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {notesCount}
        </span>
      </div>

      {isCustomFolder && (
        <div className="flex items-center gap-2 shrink-0">
          {notesCount > 0 && (
            <Button
              variant="outline"
              size="xs"
              onClick={onOpenAddNotesDialog}
              className="h-7 gap-1 text-xs cursor-pointer"
            >
              <Plus className="size-3" />
              Add/Remove Notes
            </Button>
          )}
          <Button
            variant="outline"
            size="xs"
            onClick={onRenameFolder}
            className="h-7 gap-1 text-xs cursor-pointer"
          >
            <Edit3 className="size-3 text-muted-foreground" />
            Rename
          </Button>
          <Button
            variant="ghost"
            size="xs"
            onClick={onDeleteFolder}
            className="h-7 text-xs cursor-pointer hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
          >
            Delete Folder
          </Button>
        </div>
      )}
    </div>
  );
}
