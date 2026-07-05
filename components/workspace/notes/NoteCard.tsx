"use client";

import { Note, Folder } from "@/types/note";
import { useRouter } from "next/navigation";
import { Folder as FolderIcon, Trash2, Calendar, ChevronRight, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

interface NoteCardProps {
  note: Note;
  folders: Folder[];
  onMoveNote: (noteId: string, folderId: string | null, e: React.MouseEvent) => void;
  onDeleteNote: (noteId: string, e: React.MouseEvent) => void;
  isSelected?: boolean;
  onToggleSelect?: (noteId: string) => void;
}

export default function NoteCard({
  note,
  folders,
  onMoveNote,
  onDeleteNote,
  isSelected = false,
  onToggleSelect,
}: NoteCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/workspace/notes/${note.id}`)}
      className={`group relative flex flex-col justify-between rounded-xl border bg-card p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm cursor-pointer ${
        isSelected
          ? "border-primary bg-primary/2 shadow-xs"
          : "border-border/60 hover:border-border"
      }`}
    >
      {/* Checkbox for selection */}
      {onToggleSelect && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onToggleSelect(note.id);
          }}
          className="absolute left-3 top-3.5 z-10 p-1 cursor-pointer"
        >
          <div
            className={`flex size-4 items-center justify-center rounded border transition-all duration-200 ${
              isSelected
                ? "border-primary bg-primary text-primary-foreground scale-100 opacity-100"
                : "border-border bg-background scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100"
            }`}
          >
            {isSelected && <Check className="size-2.5" strokeWidth={3} />}
          </div>
        </div>
      )}

      {/* Card top */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h3
            className={`font-medium text-sm leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-all duration-200 ${
              isSelected ? "pl-6 text-primary" : "pl-0"
            } ${onToggleSelect ? "group-hover:pl-6" : ""}`}
          >
            {note.title || "Untitled Document"}
          </h3>

          {/* Hover actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  onClick={(e) => e.stopPropagation()}
                  title="Move to folder"
                  className="flex size-6 items-center justify-center rounded-md bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                >
                  <FolderIcon className="size-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground font-semibold">
                  Move to folder
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-xs cursor-pointer"
                  onClick={(e) => onMoveNote(note.id, null, e)}
                >
                  <span className="flex items-center gap-2">
                    {!note.folderId && <Check className="size-3 text-primary" />}
                    <span className={!note.folderId ? "ml-0" : "ml-5"}>Uncategorized</span>
                  </span>
                </DropdownMenuItem>
                {folders.map((folder) => (
                  <DropdownMenuItem
                    key={folder.id}
                    className="text-xs cursor-pointer"
                    onClick={(e) => onMoveNote(note.id, folder.id, e)}
                  >
                    <span className="flex items-center gap-2">
                      {note.folderId === folder.id && <Check className="size-3 text-primary" />}
                      <span className={note.folderId === folder.id ? "" : "ml-5"}>{folder.name}</span>
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={(e) => onDeleteNote(note.id, e)}
              title="Delete note"
              className="flex size-6 items-center justify-center rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="size-3" />
            </button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-3">
          {note.generated
            ? note.generated.replace(/[#*`_-]/g, "")
            : "No preview content available."}
        </p>
      </div>

      {/* Card footer */}
      <div className="mt-5 flex flex-col gap-2 border-t border-border/40 pt-3">
        {/* Folder tag */}
        {note.folder && (
          <div className="inline-flex self-start items-center gap-1 rounded-full bg-primary/8 px-2 py-0.5 text-[9px] font-medium text-primary/80">
            <FolderIcon className="size-2.5 shrink-0" />
            <span className="truncate max-w-[120px]">{note.folder.name}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="size-3" />
            <span>
              {note.createdAt
                ? new Date(note.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Unknown date"}
            </span>
          </div>
          <span className="flex items-center font-medium opacity-0 group-hover:opacity-100 transition-opacity text-foreground">
            Open <ChevronRight className="ml-0.5 size-3" />
          </span>
        </div>
      </div>
    </div>
  );
}
