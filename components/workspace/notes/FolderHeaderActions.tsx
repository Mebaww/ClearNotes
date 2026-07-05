"use client";

import { Folder as FolderIcon, Plus, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

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
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-border/40 pb-3">
      <div className="flex items-center gap-2">
        {isCustomFolder && <FolderIcon className="size-4 text-muted-foreground" />}
        <h2 className="text-sm font-semibold text-foreground">{activeFolderName}</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {notesCount}
        </span>
      </div>

      {isCustomFolder && (
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
          <Button
            variant="outline"
            size="xs"
            onClick={onOpenAddNotesDialog}
            className="h-7 gap-1 text-xs cursor-pointer shadow-xs"
          >
            <Plus className="size-3" />
            Add/Remove Notes
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={onRenameFolder}
            className="h-7 gap-1 text-xs cursor-pointer shadow-xs"
          >
            <Edit3 className="size-3 text-muted-foreground" />
            Rename
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={onDeleteFolder}
            className="h-7 text-xs cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-muted-foreground shadow-xs"
          >
            Delete Folder
          </Button>
        </div>
      )}
    </div>
  );
}
