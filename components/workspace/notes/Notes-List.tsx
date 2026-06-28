"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { NotebookPen, Calendar, ChevronRight, Maximize2, Trash2 } from "lucide-react";
import { Note } from "@/types/note";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { sileo } from "sileo";

interface NotesListProps {
  initialNotes: Note[];
}

export default function NotesList({ initialNotes }: NotesListProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click / navigation to note details

    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    const deletePromise = axios
      .delete(`/api/notes/${id}`)
      .then(() => {
        // Update local state instantly for optimistic UI feedback
        setNotes((prev) => prev.filter((note) => note.id !== id));
        router.refresh(); // Refresh stats on layout/dashboard
      });

    sileo.promise(deletePromise, {
      loading: { title: "Deleting note..." },
      success: { title: "Note deleted successfully!" },
      error: (err: unknown) => {
        // IMPORTANT: Only read error.code — never message text or status codes.
        const code: string | undefined = axios.isAxiosError(err)
          ? err.response?.data?.error?.code
          : undefined;

        if (code === "INVALID_DOCUMENT") {
          return {
            title: "Note not found",
            description: "This note may have already been deleted.",
          };
        }

        if (code === "UNAUTHORIZED") {
          return {
            title: "Not authorised",
            description: "You don't have permission to delete this note.",
          };
        }

        return {
          title: "Failed to delete note",
          description: "An unexpected error occurred. Please try again.",
        };
      },
    });
  };


  // Empty State
  if (!notes || notes.length === 0) {
    return (
      <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card px-6 py-16 text-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <NotebookPen className="size-4" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">No notes yet</p>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Upload a document from Home to generate your first set of notes.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Grid Tile Display Layout */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => {
              router.push(`/workspace/notes/${note.id}`);
            }}
            className="group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-sm cursor-pointer"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-medium text-sm leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {note.title || "Untitled Document"}
                </h3>
                
                {/* Action buttons (Visible on Hover) */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <Maximize2 className="size-3" />
                  </span>
                  <Button
                    variant="destructive"
                    size="icon-xs"
                    onClick={(e) => handleDelete(note.id, e)}
                    title="Delete Note"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-3">
                {note.generated
                  ? note.generated.replace(/[#*`_-]/g, "")
                  : "No preview content available."}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-3 text-[10px] text-muted-foreground">
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
              <span className="flex items-center text-foreground font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Open Note <ChevronRight className="ml-0.5 size-3" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
