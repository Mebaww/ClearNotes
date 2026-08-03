"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { NotebookPen, Plus, Trash2, Folder as FolderIcon, Check } from "lucide-react";
import { Note, Folder } from "@/types/note";
import { useRouter } from "next/navigation";
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
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { sileo } from "sileo";

import FolderPillsBar from "./FolderPillsBar";
import FolderHeaderActions from "./FolderHeaderActions";
import NoteCard from "./NoteCard";
import FolderManagerDialog from "./FolderManagerDialog";
import FolderShareModal from "./FolderShareModal";


interface NotesListProps {
  initialNotes: Note[];
  initialFolders: Folder[];
  selectedFolderId: string | null;
}

type DialogStep = "name" | "select-notes";

export default function NotesList({
  initialNotes,
  initialFolders,
  selectedFolderId,
}: NotesListProps) {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [folders, setFolders] = useState<Folder[]>(initialFolders);

  // Dialog and Folder Management States
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "add-notes">("create");
  const [dialogStep, setDialogStep] = useState<DialogStep>("name");
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  // Rename & Delete Dialog States
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameFolderName, setRenameFolderName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteFolderData, setDeleteFolderData] = useState<{ id: string; name: string } | null>(null);

  // Bulk Notes Actions States
  const [bulkSelectedNoteIds, setBulkSelectedNoteIds] = useState<string[]>([]);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);

  useEffect(() => { setNotes(initialNotes); }, [initialNotes]);
  useEffect(() => { setFolders(initialFolders); }, [initialFolders]);

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setTimeout(() => {
        setDialogStep("name");
        setDialogMode("create");
        setNewFolderName("");
        setSelectedNoteIds([]);
      }, 200);
    }
  };

  const handleOpenAddNotesDialog = () => {
    if (!selectedFolderId || selectedFolderId === "uncategorized") return;
    setDialogMode("add-notes");
    setNewFolderName(activeFolderName);
    setDialogStep("select-notes");

    // Pre-select notes that are already in this folder
    const currentNoteIds = notes
      .filter((n) => n.folderId === selectedFolderId)
      .map((n) => n.id);
    setSelectedNoteIds(currentNoteIds);
    setDialogOpen(true);
  };

  const handleCreateFolder = async () => {
    if (dialogMode === "add-notes") {
      if (!selectedFolderId) return;
      setIsCreating(true);

      try {
        const previousNoteIds = notes
          .filter((n) => n.folderId === selectedFolderId)
          .map((n) => n.id);

        const notesToAdd = selectedNoteIds.filter((id) => !previousNoteIds.includes(id));
        const notesToRemove = previousNoteIds.filter((id) => !selectedNoteIds.includes(id));

        if (notesToAdd.length > 0) {
          await axios.patch("/api/notes/bulk", {
            noteIds: notesToAdd,
            folderId: selectedFolderId,
          });
        }

        if (notesToRemove.length > 0) {
          await axios.patch("/api/notes/bulk", {
            noteIds: notesToRemove,
            folderId: null,
          });
        }

        // Update local state notes
        const targetFolder = folders.find((f) => f.id === selectedFolderId) || null;
        setNotes((prev) =>
          prev.map((note) => {
            if (notesToAdd.includes(note.id)) {
              return { ...note, folderId: selectedFolderId, folder: targetFolder };
            }
            if (notesToRemove.includes(note.id)) {
              return { ...note, folderId: null, folder: null };
            }
            return note;
          })
        );

        // Update folder counts
        setFolders((prev) =>
          prev.map((f) => {
            if (f.id === selectedFolderId) {
              return { ...f, _count: { notes: selectedNoteIds.length } };
            }
            return f;
          })
        );

        handleDialogOpenChange(false);
        sileo.success({ title: `Folder notes updated!` });
        router.refresh();
      } catch (err) {
        console.error(err);
        sileo.error({ title: "Failed to update notes", description: "Please try again." });
      } finally {
        setIsCreating(false);
      }
      return;
    }

    const name = newFolderName.trim();
    if (!name) return;
    setIsCreating(true);

    try {
      const res = await axios.post("/api/folders", { name });
      if (!res.data.success) throw new Error();
      const created: Folder = res.data.folder;

      if (selectedNoteIds.length > 0) {
        await axios.patch("/api/notes/bulk", {
          noteIds: selectedNoteIds,
          folderId: created.id,
        });
      }

      setFolders((prev) =>
        [...prev, { ...created, _count: { notes: selectedNoteIds.length } }]
          .sort((a, b) => a.name.localeCompare(b.name))
      );

      if (selectedNoteIds.length > 0) {
        setNotes((prev) =>
          prev.map((note) =>
            selectedNoteIds.includes(note.id)
              ? { ...note, folderId: created.id, folder: created }
              : note
          )
        );
      }

      handleDialogOpenChange(false);
      setBulkSelectedNoteIds([]); // Clear bulk actions selection if any
      sileo.success({ title: `"${name}" folder created!` });
      router.refresh();
      router.push(`/workspace/notes?folderId=${created.id}`);
    } catch {
      sileo.error({ title: "Failed to create folder", description: "Please try again." });
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenRenameDialog = () => {
    if (!selectedFolderId || !activeFolder) return;
    setRenameFolderName(activeFolder.name);
    setRenameDialogOpen(true);
  };

  const handleRenameFolder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedFolderId || !activeFolder) return;
    const trimmedName = renameFolderName.trim();
    if (!trimmedName || trimmedName === activeFolder.name) {
      setRenameDialogOpen(false);
      return;
    }

    setIsRenaming(true);
    try {
      const res = await axios.patch(`/api/folders/${selectedFolderId}`, { name: trimmedName });
      if (res.data.success && res.data.folder) {
        setFolders((prev) =>
          prev.map((f) => (f.id === selectedFolderId ? { ...f, name: trimmedName } : f))
        );
        sileo.success({ title: "Folder renamed!" });
        setRenameDialogOpen(false);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      sileo.error({ title: "Failed to rename folder", description: "Folder name may already be taken." });
    } finally {
      setIsRenaming(false);
    }
  };

  const handleDeleteFolderTrigger = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDeleteFolderData({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDeleteFolder = async () => {
    if (!deleteFolderData) return;
    const { id } = deleteFolderData;

    const deletePromise = axios.delete(`/api/folders/${id}`).then(() => {
      setFolders((prev) => prev.filter((f) => f.id !== id));
      if (selectedFolderId === id) router.push("/workspace/notes");
      router.refresh();
    });

    sileo.promise(deletePromise, {
      loading: { title: "Deleting folder..." },
      success: { title: "Folder deleted." },
      error: () => ({ title: "Failed to delete folder" }),
    });

    setDeleteDialogOpen(false);
    setDeleteFolderData(null);
  };

  const handleMoveNote = async (noteId: string, folderId: string | null, e: React.MouseEvent) => {
    e.stopPropagation();
    const targetFolder = folders.find((f) => f.id === folderId) || null;

    setNotes((prev) =>
      prev.map((n) => n.id === noteId ? { ...n, folderId, folder: targetFolder } : n)
    );

    try {
      await axios.patch(`/api/notes/${noteId}`, { folderId });
      router.refresh();
    } catch {
      setNotes(initialNotes);
      sileo.error({ title: "Failed to move note" });
    }
  };

  const handleDeleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this note?")) return;

    const deletePromise = axios.delete(`/api/notes/${id}`).then(() => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      router.refresh();
    });

    sileo.promise(deletePromise, {
      loading: { title: "Deleting note..." },
      success: { title: "Note deleted!" },
      error: () => ({ title: "Failed to delete note" }),
    });
  };

  const handleToggleSelectNote = (noteId: string) => {
    setBulkSelectedNoteIds((prev) =>
      prev.includes(noteId) ? prev.filter((id) => id !== noteId) : [...prev, noteId]
    );
  };

  const handleBulkMove = async (folderId: string | null) => {
    if (bulkSelectedNoteIds.length === 0) return;

    const previousNotes = [...notes];
    const targetFolder = folders.find((f) => f.id === folderId) || null;

    // Optimistically update notes local state
    setNotes((prev) =>
      prev.map((n) =>
        bulkSelectedNoteIds.includes(n.id)
          ? { ...n, folderId, folder: targetFolder }
          : n
      )
    );

    try {
      await axios.patch("/api/notes/bulk", {
        noteIds: bulkSelectedNoteIds,
        folderId,
      });

      // Update folder counts local state
      setFolders((prev) =>
        prev.map((f) => {
          let countDiff = 0;
          bulkSelectedNoteIds.forEach((id) => {
            const note = previousNotes.find((n) => n.id === id);
            if (note) {
              if (note.folderId === f.id && folderId !== f.id) {
                countDiff -= 1;
              } else if (note.folderId !== f.id && folderId === f.id) {
                countDiff += 1;
              }
            }
          });
          return {
            ...f,
            _count: {
              notes: (f._count?.notes || 0) + countDiff,
            },
          };
        })
      );

      sileo.success({ title: `${bulkSelectedNoteIds.length} notes moved successfully.` });
      setBulkSelectedNoteIds([]);
      router.refresh();
    } catch (err) {
      console.error(err);
      setNotes(previousNotes);
      sileo.error({ title: "Failed to move notes", description: "Please try again." });
    }
  };

  const handleBulkCreateFolderWithSelected = () => {
    setDialogMode("create");
    setSelectedNoteIds(bulkSelectedNoteIds);
    setDialogStep("name");
    setNewFolderName("");
    setDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (bulkSelectedNoteIds.length === 0) return;

    const previousNotes = [...notes];

    // Optimistically update notes state
    setNotes((prev) => prev.filter((n) => !bulkSelectedNoteIds.includes(n.id)));

    const deletePromise = axios
      .request({
        url: "/api/notes/bulk",
        method: "DELETE",
        data: { noteIds: bulkSelectedNoteIds },
      })
      .then(() => {
        setBulkSelectedNoteIds([]);
        router.refresh();
      })
      .catch((err) => {
        setNotes(previousNotes);
        throw err;
      });

    sileo.promise(deletePromise, {
      loading: { title: `Deleting ${bulkSelectedNoteIds.length} notes...` },
      success: { title: "Notes deleted successfully." },
      error: () => ({ title: "Failed to delete notes" }),
    });

    setBulkDeleteConfirmOpen(false);
  };

  const handleSelectFolder = (folderId: string | null) => {
    setBulkSelectedNoteIds([]); // Clear selection when switching folders
    if (folderId) {
      router.push(`/workspace/notes?folderId=${folderId}`);
    } else {
      router.push("/workspace/notes");
    }
  };

  // Filter notes client-side dynamically
  const displayedNotes = notes.filter((note) => {
    if (selectedFolderId === "uncategorized") return note.folderId === null;
    if (selectedFolderId) return note.folderId === selectedFolderId;
    return true;
  });

  const activeFolder = folders.find((f) => f.id === selectedFolderId);
  const activeFolderName =
    selectedFolderId === "uncategorized" ? "Uncategorized"
    : activeFolder ? activeFolder.name
    : "All Notes";

  // Folder Share Modal State
  const [folderShareModalOpen, setFolderShareModalOpen] = useState(false);
  const activeFolderShare = activeFolder?.share || null;

  return (
    <div className="mt-6 space-y-6">
      {/* ── Filter bar ─────────────────────────────────────── */}
      <FolderPillsBar
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={handleSelectFolder}
        onDeleteFolder={handleDeleteFolderTrigger}
        onCreateFolderTrigger={() => {
          setDialogMode("create");
          setDialogOpen(true);
        }}
      />

      {/* ── Folder title & actions ─────────────────────────── */}
      <FolderHeaderActions
        selectedFolderId={selectedFolderId}
        activeFolderName={activeFolderName}
        notesCount={displayedNotes.length}
        isShared={!!activeFolderShare?.enabled}
        onOpenAddNotesDialog={handleOpenAddNotesDialog}
        onRenameFolder={handleOpenRenameDialog}
        onDeleteFolder={(e) => {
          if (selectedFolderId && selectedFolderId !== "uncategorized") {
            handleDeleteFolderTrigger(selectedFolderId, activeFolderName, e);
          }
        }}
        onShareFolder={() => setFolderShareModalOpen(true)}
      />

      {/* ── Notes Grid / Empty State ───────────────────────── */}
      {displayedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card px-6 py-16 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <NotebookPen className="size-4" />
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">No notes here</p>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            {selectedFolderId
              ? "This folder is currently empty. You can select notes and add them here."
              : "Upload a document from Home to generate your first notes."}
          </p>
          {selectedFolderId && selectedFolderId !== "uncategorized" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenAddNotesDialog}
              className="mt-4 gap-1.5 text-xs cursor-pointer"
            >
              <Plus className="size-3.5" />
              Add Notes
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              folders={folders}
              onMoveNote={handleMoveNote}
              onDeleteNote={handleDeleteNote}
              isSelected={bulkSelectedNoteIds.includes(note.id)}
              onToggleSelect={handleToggleSelectNote}
            />
          ))}
        </div>
      )}

      {/* ── Folder Manager Dialog ────────────────────────────── */}
      <FolderManagerDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        dialogMode={dialogMode}
        dialogStep={dialogStep}
        setDialogStep={setDialogStep}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        selectedFolderId={selectedFolderId}
        notes={notes}
        selectedNoteIds={selectedNoteIds}
        setSelectedNoteIds={setSelectedNoteIds}
        isCreating={isCreating}
        onSave={handleCreateFolder}
      />

      {/* ── Rename Folder Dialog ────────────────────────────── */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle className="text-base">Rename Folder</DialogTitle>
            <DialogDescription>
              Enter a new name for the folder &ldquo;{activeFolder?.name}&rdquo;.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRenameFolder} className="space-y-5">
            <div>
              <label className="text-xs font-medium text-foreground mb-3 block">Folder name</label>
              <Input
                autoFocus
                placeholder="e.g. Finance, Project Ideas…"
                value={renameFolderName}
                onChange={(e) => setRenameFolderName(e.target.value)}
                maxLength={50}
                className="h-9"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRenameDialogOpen(false)}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isRenaming || !renameFolderName.trim() || renameFolderName.trim() === activeFolder?.name}
                className="cursor-pointer"
              >
                {isRenaming ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Folder AlertDialog ───────────────────────── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent size="default">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the folder &ldquo;{deleteFolderData?.name}&rdquo;? Notes inside will not be deleted &mdash; they'll become uncategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmDeleteFolder}
              className="cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Bulk Actions Floating Toolbar ────────────────────── */}
      {bulkSelectedNoteIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-[2rem] border border-border/80 bg-background/90 backdrop-blur-md px-4 py-2.5 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-200 w-[95%] sm:w-auto max-w-sm sm:max-w-none">
          <span className="text-xs font-semibold text-foreground px-1 pl-2 whitespace-nowrap">
            {bulkSelectedNoteIds.length} selected
          </span>

          <div className="hidden sm:block h-4 w-px bg-border/80" />

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="xs" className="h-7 gap-1 text-xs cursor-pointer shadow-xs">
                  <FolderIcon className="size-3 text-muted-foreground" />
                  Move to
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuLabel className="text-[10px] uppercase text-muted-foreground font-semibold">
                  Move to Folder
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-xs cursor-pointer"
                  onClick={() => handleBulkMove(null)}
                >
                  Uncategorized
                </DropdownMenuItem>
                {folders.map((folder) => (
                  <DropdownMenuItem
                    key={folder.id}
                    className="text-xs cursor-pointer"
                    onClick={() => handleBulkMove(folder.id)}
                  >
                    {folder.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-xs cursor-pointer font-medium text-primary"
                  onClick={handleBulkCreateFolderWithSelected}
                >
                  + Create New Folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="xs"
              onClick={() => setBulkDeleteConfirmOpen(true)}
              className="h-7 gap-1 text-xs cursor-pointer hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-muted-foreground shadow-xs"
            >
              <Trash2 className="size-3 text-muted-foreground" />
              Delete
            </Button>

            <Button
              variant="outline"
              size="xs"
              onClick={() => setBulkSelectedNoteIds([])}
              className="h-7 text-xs cursor-pointer text-muted-foreground shadow-xs"
            >
              Deselect
            </Button>
          </div>
        </div>
      )}

      {/* ── Bulk Delete AlertDialog ─────────────────────────── */}
      <AlertDialog open={bulkDeleteConfirmOpen} onOpenChange={setBulkDeleteConfirmOpen}>
        <AlertDialogContent size="default">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Notes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete these {bulkSelectedNoteIds.length} selected notes? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmBulkDelete}
              className="cursor-pointer"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Folder Share Modal ─────────────────────────────── */}

      {selectedFolderId && selectedFolderId !== "uncategorized" && (
        <FolderShareModal
          folderId={selectedFolderId}
          folderName={activeFolderName}
          initialShare={activeFolderShare}
          isOpen={folderShareModalOpen}
          onOpenChange={setFolderShareModalOpen}
          onShareStatusChange={(updatedShare) => {
            if (updatedShare !== undefined) {
              setFolders((prev) =>
                prev.map((f) =>
                  f.id === selectedFolderId ? { ...f, share: updatedShare } : f
                )
              );
            }
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

