"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { NotebookPen, Plus } from "lucide-react";
import { Note, Folder } from "@/types/note";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { sileo } from "sileo";

// Custom Subcomponents
import FolderPillsBar from "./FolderPillsBar";
import FolderHeaderActions from "./FolderHeaderActions";
import NoteCard from "./NoteCard";
import FolderManagerDialog from "./FolderManagerDialog";

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
      sileo.success({ title: `"${name}" folder created!` });
      router.refresh();
      router.push(`/workspace/notes?folderId=${created.id}`);
    } catch {
      sileo.error({ title: "Failed to create folder", description: "Please try again." });
    } finally {
      setIsCreating(false);
    }
  };

  const handleRenameFolderPrompt = async () => {
    if (!selectedFolderId || !activeFolder) return;
    const newName = prompt("Rename folder to:", activeFolder.name);
    if (!newName || !newName.trim() || newName.trim() === activeFolder.name) return;

    const trimmedName = newName.trim();
    try {
      const res = await axios.patch(`/api/folders/${selectedFolderId}`, { name: trimmedName });
      if (res.data.success && res.data.folder) {
        setFolders((prev) =>
          prev.map((f) => (f.id === selectedFolderId ? { ...f, name: trimmedName } : f))
        );
        sileo.success({ title: "Folder renamed!" });
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      sileo.error({ title: "Failed to rename folder", description: "Folder name may already be taken." });
    }
  };

  const handleDeleteFolder = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!confirm(`Delete the "${name}" folder? Notes inside will not be deleted — they'll become uncategorized.`)) return;

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

  const handleSelectFolder = (folderId: string | null) => {
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

  return (
    <div className="mt-6 space-y-6">
      {/* ── Filter bar ─────────────────────────────────────── */}
      <FolderPillsBar
        folders={folders}
        selectedFolderId={selectedFolderId}
        onSelectFolder={handleSelectFolder}
        onDeleteFolder={handleDeleteFolder}
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
        onOpenAddNotesDialog={handleOpenAddNotesDialog}
        onRenameFolder={handleRenameFolderPrompt}
        onDeleteFolder={(e) => handleDeleteFolder(selectedFolderId!, activeFolderName, e)}
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
    </div>
  );
}
