"use client";

import { Folder } from "@/types/note";
import { Folder as FolderIcon, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FolderPillsBarProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  onDeleteFolder: (id: string, name: string, e: React.MouseEvent) => void;
  onCreateFolderTrigger: () => void;
}

export default function FolderPillsBar({
  folders,
  selectedFolderId,
  onSelectFolder,
  onDeleteFolder,
  onCreateFolderTrigger,
}: FolderPillsBarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 flex-1 min-w-0">
          {/* All Notes pill */}
          <button
            onClick={() => onSelectFolder(null)}
            className={`inline-flex h-7 shrink-0 cursor-pointer items-center rounded-full border px-3 text-xs font-medium transition-colors ${
              selectedFolderId === null
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground"
            }`}
          >
            All Notes
          </button>

          {/* Folder pills */}
          {folders.map((folder) => (
            <div key={folder.id} className="group relative inline-flex shrink-0">
              <button
                onClick={() => onSelectFolder(folder.id)}
                className={`inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border pl-2.5 pr-7 text-xs font-medium transition-colors ${
                  selectedFolderId === folder.id
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground"
                }`}
              >
                <FolderIcon className="size-3 shrink-0 opacity-60" />
                {folder.name}
                {folder._count?.notes !== undefined && (
                  <span className="ml-0.5 text-[9px] opacity-60">
                    {folder._count.notes}
                  </span>
                )}
              </button>
              {/* Delete × on hover */}
              <button
                onClick={(e) => onDeleteFolder(folder.id, folder.name, e)}
                title="Delete folder"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 flex size-4 items-center justify-center rounded-full opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
              >
                <X className="size-2.5" />
              </button>
            </div>
          ))}
        </div>

        {/* New Folder button */}
        <Button
          size="sm"
          variant="outline"
          className="h-7 shrink-0 gap-1.5 text-xs cursor-pointer"
          onClick={onCreateFolderTrigger}
        >
          <Plus className="size-3.5" />
          New Folder
        </Button>
      </div>
    </div>
  );
}
