"use client";

import axios from "axios";
import { ArrowLeft, Trash2, Folder as FolderIcon, Plus, Check, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Note, Folder, NoteShare } from "@/types/note";
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
import { MarkdownContent } from "./MarkdownContent";
import { ShareModal } from "./ShareModal";

interface Props {
  note: Note;
  isReadOnly?: boolean;
  onBack?: () => void;
  /** If set, the Back button navigates to this URL instead of window.history.back() */
  backHref?: string;
}

export default function NoteViewer({ note, isReadOnly = false, onBack, backHref }: Props) {

  const router = useRouter();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolder, setActiveFolder] = useState<Folder | null>(note.folder || null);
  const [shareInfo, setShareInfo] = useState<NoteShare | null>(note.share || null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (isReadOnly) return;
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
  }, [isReadOnly]);

  useEffect(() => {
    if (isReadOnly) return;
    async function loadShareInfo() {
      try {
        const res = await axios.get(`/api/notes/${note.id}/share`);
        if (res.data.success) {
          setShareInfo(res.data.share);
        }
      } catch (err) {
        console.error("Failed to fetch share info", err);
      }
    }
    loadShareInfo();
  }, [note.id, isReadOnly]);

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

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/workspace");
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-3 py-4 sm:px-6 sm:py-8">
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">Back</span>
        </button>

        {!isReadOnly && (
          <div className="flex items-center gap-1.5">
            {/* Share button — icon-only on mobile */}
            <Button
              variant={shareInfo?.enabled ? "default" : "outline"}
              size="sm"
              onClick={() => setIsShareModalOpen(true)}
              title={shareInfo?.enabled ? "Shared" : "Share"}
              className="h-8 w-8 p-0 sm:w-auto sm:px-3 cursor-pointer"
            >
              <Share2 className="size-3.5 shrink-0" />
              <span className="hidden sm:inline ml-1 text-xs font-medium">
                {shareInfo?.enabled ? "Shared" : "Share"}
              </span>
            </Button>

            {/* Folder button */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  title={activeFolder ? activeFolder.name : "Add to Folder"}
                  className="h-8 w-8 p-0 sm:w-auto sm:px-3 cursor-pointer"
                >
                  <FolderIcon className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="hidden sm:inline ml-1 text-xs font-medium">
                    {activeFolder ? activeFolder.name : "Folder"}
                  </span>
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

            {/* Delete button — icon-only on mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              title="Delete Note"
              className="h-8 w-8 p-0 sm:w-auto sm:px-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            >
              <Trash2 className="size-3.5 shrink-0" />
              <span className="hidden sm:inline ml-1 text-xs">Delete</span>
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-card p-4 sm:p-8">
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

        <MarkdownContent content={note.generated ?? ""} />
      </div>

      {!isReadOnly && (
        <ShareModal
          noteId={note.id}
          initialShare={shareInfo}
          isOpen={isShareModalOpen}
          onOpenChange={setIsShareModalOpen}
          onShareStatusChange={(updatedShare) => {
            if (updatedShare !== undefined) {
              setShareInfo(updatedShare);
            }
          }}
        />
      )}

    </main>
  );
}