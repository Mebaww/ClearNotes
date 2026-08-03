"use client";

import { Folder as FolderIcon, Plus, Edit3, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FolderHeaderActionsProps {

  selectedFolderId: string | null;
  activeFolderName: string;
  notesCount: number;
  isShared?: boolean;
  onOpenAddNotesDialog: () => void;
  onRenameFolder: () => void;
  onDeleteFolder: (e: React.MouseEvent) => void;
  onShareFolder?: () => void;
}

export default function FolderHeaderActions({
  selectedFolderId,
  activeFolderName,
  notesCount,
  isShared,
  onOpenAddNotesDialog,
  onRenameFolder,
  onDeleteFolder,
  onShareFolder,
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
        {isShared && (
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            Shared Link Active
          </span>
        )}
      </div>

      {isCustomFolder && (
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
          {onShareFolder && (
            <Button
              variant={isShared ? "default" : "outline"}
              size="xs"
              onClick={onShareFolder}
              className="h-7 gap-1 text-xs cursor-pointer shadow-xs"
            >
              <Share2 className="size-3" />
              {isShared ? "Shared" : "Share"}
            </Button>
          )}
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

