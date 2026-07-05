"use client";

import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import { ArrowLeft, Trash2, Folder as FolderIcon, Plus, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Note, Folder } from "@/types/note";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { sileo } from "sileo";

interface Props {
  note: Note;
}

export default function NoteViewer({ note }: Props) {
  const router = useRouter();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolder, setActiveFolder] = useState<Folder | null>(note.folder || null);

  useEffect(() => {
    async function loadFolders() {
      try {
        const res = await fetch("/api/folders");
        const data = await res.json();
        if (data.success && data.folders) {
          setFolders(data.folders);
        }
      } catch (err) {
        console.error("Failed to load folders for selector", err);
      }
    }
    loadFolders();
  }, []);

  const handleSelectFolder = async (folderId: string | null) => {
    const prevFolder = activeFolder;
    // Optimistic UI update
    const selected = folders.find((f) => f.id === folderId) || null;
    setActiveFolder(selected);

    try {
      const res = await axios.patch(`/api/notes/${note.id}`, { folderId });
      if (res.data.success) {
        sileo.success({ title: "Folder updated successfully!" });
        router.refresh();
      } else {
        throw new Error();
      }
    } catch (err) {
      setActiveFolder(prevFolder);
      console.error(err);
      sileo.error({ title: "Failed to update folder" });
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt("Enter new folder name:");
    if (!name || !name.trim()) return;

    try {
      const res = await axios.post("/api/folders", { name: name.trim() });
      if (res.data.success && res.data.folder) {
        const createdFolder = res.data.folder;
        setFolders((prev) =>
          [...prev, createdFolder].sort((a, b) => a.name.localeCompare(b.name))
        );
        await handleSelectFolder(createdFolder.id);
      }
    } catch (err) {
      console.error(err);
      sileo.error({ title: "Failed to create folder" });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    const deletePromise = axios
      .delete(`/api/notes/${note.id}`)
      .then(() => {
        router.push("/workspace/notes");
        router.refresh();
      });

    sileo.promise(deletePromise, {
      loading: { title: "Deleting note..." },
      success: { title: "Note deleted successfully!" },
      error: (err: unknown) => {
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

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/workspace/notes")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Notes
        </button>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5 h-8 text-xs cursor-pointer font-medium"
              >
                <FolderIcon className="size-3.5 text-muted-foreground" />
                <span>{activeFolder ? activeFolder.name : "Add to Folder"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover border border-border shadow-md">
              <DropdownMenuLabel className="text-muted-foreground font-semibold px-2 py-1.5 text-xs">
                Move to Subject
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <div className="max-h-[200px] overflow-y-auto">
                <DropdownMenuItem
                  onClick={() => handleSelectFolder(null)}
                  className="text-xs flex items-center justify-between cursor-pointer"
                >
                  <span className="truncate">Uncategorized</span>
                  {!activeFolder && <Check className="size-3.5 text-primary" />}
                </DropdownMenuItem>

                {folders.map((folder) => (
                  <DropdownMenuItem
                    key={folder.id}
                    onClick={() => handleSelectFolder(folder.id)}
                    className="text-xs flex items-center justify-between cursor-pointer"
                  >
                    <span className="truncate">{folder.name}</span>
                    {activeFolder?.id === folder.id && (
                      <Check className="size-3.5 text-primary" />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleCreateFolder}
                className="text-xs flex items-center gap-2 cursor-pointer font-medium"
              >
                <Plus className="size-3.5 text-muted-foreground" />
                <span>Create New Folder...</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="flex items-center gap-1.5 h-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            Delete Note
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-5">
          <p className="text-xs text-muted-foreground">
            {new Date(note.createdAt).toLocaleDateString()}
          </p>

          {activeFolder && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              <FolderIcon className="size-3 text-muted-foreground" />
              <span>{activeFolder.name}</span>
            </div>
          )}
        </div>

        <article className="max-w-none overflow-x-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1: ({ ...props }) => (
                <h1
                  className="mt-8 mb-4 text-3xl font-bold tracking-tight"
                  {...props}
                />
              ),

              h2: ({ ...props }) => (
                <h2
                  className="mt-8 mb-3 border-b pb-2 text-2xl font-semibold"
                  {...props}
                />
              ),

              h3: ({ ...props }) => (
                <h3
                  className="mt-6 mb-2 text-xl font-semibold"
                  {...props}
                />
              ),

              p: ({ ...props }) => (
                <p
                  className="mb-4 leading-7 text-muted-foreground"
                  {...props}
                />
              ),

              ul: ({ ...props }) => (
                <ul
                  className="mb-4 list-disc space-y-2 pl-6"
                  {...props}
                />
              ),

              ol: ({ ...props }) => (
                <ol
                  className="mb-4 list-decimal space-y-2 pl-6"
                  {...props}
                />
              ),

              li: ({ ...props }) => (
                <li
                  className="leading-7 text-muted-foreground"
                  {...props}
                />
              ),

              strong: ({ ...props }) => (
                <strong
                  className="font-semibold text-foreground"
                  {...props}
                />
              ),

              blockquote: ({ ...props }) => (
                <blockquote
                  className="my-4 border-l-4 border-border pl-4 italic text-muted-foreground"
                  {...props}
                />
              ),

              code: ({ className, ...props }) => (
                <code
                  className={`rounded bg-muted px-1.5 py-0.5 text-sm ${className ?? ""}`}
                  {...props}
                />
              ),

              hr: ({ ...props }) => (
                <hr
                  className="my-8 border-border"
                  {...props}
                />
              ),

              table: ({ ...props }) => (
                <table
                  className="my-6 w-full border-collapse text-sm"
                  {...props}
                />
              ),

              thead: ({ ...props }) => (
                <thead
                  className="bg-muted"
                  {...props}
                />
              ),

              tbody: ({ ...props }) => (
                <tbody {...props} />
              ),

              tr: ({ ...props }) => (
                <tr
                  className="border-b border-border"
                  {...props}
                />
              ),

              th: ({ ...props }) => (
                <th
                  className="border border-border px-4 py-2 text-left font-semibold"
                  {...props}
                />
              ),

              td: ({ ...props }) => (
                <td
                  className="border border-border px-4 py-2 align-top text-muted-foreground"
                  {...props}
                />
              ),
            }}
          >
            {note.generated ?? ""}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}