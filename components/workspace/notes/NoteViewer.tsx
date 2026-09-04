"use client";

import axios from "axios";
import { ArrowLeft, Trash2, Folder as FolderIcon, Plus, Check, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Note, Folder, NoteShare } from "@/types/note";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  backHref?: string;
}

export default function NoteViewer({ note, isReadOnly = false, onBack, backHref }: Props) {
  const router = useRouter();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolder, setActiveFolder] = useState<Folder | null>(note.folder || null);
  const [shareInfo, setShareInfo] = useState<NoteShare | null>(note.share || null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [createFolderOpen, setCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

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

  const handleCreateFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFolderName.trim();
    if (!trimmed || isCreatingFolder) return;

    setIsCreatingFolder(true);
    try {
      const res = await axios.post("/api/folders", { name: trimmed });
      if (res.data.success && res.data.folder) {
        const createdFolder = res.data.folder;
        setFolders((prev) =>
          [...prev, createdFolder].sort((a, b) => a.name.localeCompare(b.name))
        );
        await handleSelectFolder(createdFolder.id);
        setNewFolderName("");
        setCreateFolderOpen(false);
      }
    } catch (err) {
      console.error(err);
      sileo.error({ title: "Failed to create folder" });
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleConfirmDelete = async () => {
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
    } else {
      window.history.back();
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="gap-2 cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        {!isReadOnly && (
          <div className="flex items-center gap-2">
            <Button
              variant={shareInfo?.enabled ? "secondary" : "outline"}
              size="sm"
              onClick={() => setIsShareModalOpen(true)}
              className="gap-1.5 cursor-pointer relative"
            >
              <Share2 className="size-3.5" />
              <span>{shareInfo?.enabled ? "Shared" : "Share"}</span>
              {shareInfo?.enabled && (
                <span className="size-1.5 rounded-full bg-primary absolute -top-0.5 -right-0.5 ring-2 ring-background" />
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 cursor-pointer max-w-[160px] truncate"
                >
                  <FolderIcon className="size-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">
                    {activeFolder ? activeFolder.name : "Organise"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                  Move to folder
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => handleSelectFolder(null)}
                  className="flex items-center justify-between cursor-pointer text-xs"
                >
                  <span className="text-muted-foreground">None (Uncategorized)</span>
                  {activeFolder === null && <Check className="size-3 text-primary" />}
                </DropdownMenuItem>

                {folders.map((folder) => (
                  <DropdownMenuItem
                    key={folder.id}
                    onClick={() => handleSelectFolder(folder.id)}
                    className="flex items-center justify-between cursor-pointer text-xs"
                  >
                    <span className="truncate">{folder.name}</span>
                    {activeFolder?.id === folder.id && (
                      <Check className="size-3 text-primary shrink-0" />
                    )}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setNewFolderName("");
                    setCreateFolderOpen(true);
                  }}
                  className="flex items-center gap-2 cursor-pointer text-xs text-primary font-medium"
                >
                  <Plus className="size-3.5" />
                  <span>New folder...</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteConfirmOpen(true)}
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

      {/* In-app Create Folder Dialog */}
      <Dialog open={createFolderOpen} onOpenChange={setCreateFolderOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">New Folder</DialogTitle>
            <DialogDescription className="text-xs">
              Enter a name for the new folder to organize this note.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateFolderSubmit} className="space-y-4 pt-2">
            <Input
              autoFocus
              placeholder="e.g. Research, Lecture Notes..."
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="text-sm"
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCreateFolderOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!newFolderName.trim() || isCreatingFolder}
              >
                Create & Move
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* In-app Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent size="default">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &ldquo;{note.title || "this note"}&rdquo;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Delete Note
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}