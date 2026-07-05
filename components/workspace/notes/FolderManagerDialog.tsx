"use client";

import { useState, useEffect } from "react";
import { Folder as FolderIcon, Check, Search, ArrowRight } from "lucide-react";
import { Note } from "@/types/note";
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

interface FolderManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogMode: "create" | "add-notes";
  dialogStep: "name" | "select-notes";
  setDialogStep: (step: "name" | "select-notes") => void;
  newFolderName: string;
  setNewFolderName: (name: string) => void;
  selectedFolderId: string | null;
  notes: Note[];
  selectedNoteIds: string[];
  setSelectedNoteIds: React.Dispatch<React.SetStateAction<string[]>>;
  isCreating: boolean;
  onSave: () => void;
}

export default function FolderManagerDialog({
  open,
  onOpenChange,
  dialogMode,
  dialogStep,
  setDialogStep,
  newFolderName,
  setNewFolderName,
  selectedFolderId,
  notes,
  selectedNoteIds,
  setSelectedNoteIds,
  isCreating,
  onSave,
}: FolderManagerDialogProps) {
  const [noteSearch, setNoteSearch] = useState("");
  const [pickerTab, setPickerTab] = useState<"add" | "current">("add");

  // Reset search and tab on close/open
  useEffect(() => {
    if (!open) {
      setNoteSearch("");
      setPickerTab("add");
    }
  }, [open]);

  const handleNameNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setDialogStep("select-notes");
  };

  const toggleNoteSelection = (id: string) => {
    setSelectedNoteIds((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const pickableNotes = notes.filter((n) => {
    const matchesSearch = (n.title || "Untitled").toLowerCase().includes(noteSearch.toLowerCase());
    if (!matchesSearch) return false;

    if (dialogMode === "add-notes") {
      if (pickerTab === "add") {
        return !selectedNoteIds.includes(n.id);
      } else {
        return selectedNoteIds.includes(n.id);
      }
    }
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        {/* ── Step 1: Name ── */}
        {dialogStep === "name" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-base">Create a folder</DialogTitle>
              <DialogDescription>
                Give your folder a name. You'll add notes to it in the next step.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleNameNext} className="space-y-5">
              <div>
                <label className="text-xs font-medium text-foreground mb-3 block">Folder name</label>
                <Input
                  autoFocus
                  placeholder="e.g. Finance, Project Ideas…"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  maxLength={50}
                  className="h-9"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!newFolderName.trim()}
                  className="gap-1.5 cursor-pointer"
                >
                  Next
                  <ArrowRight className="size-3.5" />
                </Button>
              </DialogFooter>
            </form>
          </>
        )}

        {/* ── Step 2: Pick notes ── */}
        {dialogStep === "select-notes" && (
          <>
            <DialogHeader>
              {dialogMode === "create" && (
                <div className="flex items-center gap-2 mb-0.5">
                  <button
                    onClick={() => setDialogStep("name")}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    ← Back
                  </button>
                </div>
              )}
              <DialogTitle className="text-base">
                {dialogMode === "add-notes"
                  ? `Manage notes in &ldquo;${newFolderName}&rdquo;`
                  : `Add notes to &ldquo;${newFolderName}&rdquo;`}
              </DialogTitle>
              <DialogDescription>
                Select which notes belong in this folder.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search notes…"
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  className="h-8 pl-8 text-xs"
                />
              </div>

              {/* Tabs for Add-Notes Mode */}
              {dialogMode === "add-notes" && (
                <div className="flex border-b border-border/40 mb-3">
                  <button
                    type="button"
                    onClick={() => setPickerTab("add")}
                    className={`flex-1 pb-2 text-xs font-semibold text-center border-b-2 cursor-pointer transition-colors ${
                      pickerTab === "add"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Add Notes ({notes.filter(n => !selectedNoteIds.includes(n.id)).length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickerTab("current")}
                    className={`flex-1 pb-2 text-xs font-semibold text-center border-b-2 cursor-pointer transition-colors ${
                      pickerTab === "current"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    In Folder ({selectedNoteIds.length})
                  </button>
                </div>
              )}

              {/* Note list */}
              <div className="max-h-[280px] overflow-y-auto -mx-1 px-1 space-y-1 pr-2">
                {pickableNotes.length === 0 ? (
                  <p className="py-8 text-center text-xs text-muted-foreground">
                    No notes found.
                  </p>
                ) : (
                  pickableNotes.map((note) => {
                    const isSelected = selectedNoteIds.includes(note.id);
                    return (
                      <button
                        key={note.id}
                        type="button"
                        onClick={() => toggleNoteSelection(note.id)}
                        className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? "border-primary/40 bg-primary/5"
                            : "border-transparent bg-muted/40 hover:bg-muted/70"
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background"
                          }`}
                        >
                          {isSelected && <Check className="size-2.5" strokeWidth={3} />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">
                            {note.title || "Untitled Document"}
                          </p>
                          {note.folder && note.folderId !== selectedFolderId && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              Currently in: {note.folder.name}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {selectedNoteIds.length > 0 && (
                <p className="text-[11px] text-muted-foreground text-center">
                  {selectedNoteIds.length} note{selectedNoteIds.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            <DialogFooter>
              {dialogMode === "create" && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onSave}
                  disabled={isCreating}
                  className="text-xs cursor-pointer"
                >
                  {isCreating ? "Creating…" : "Create without notes"}
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                onClick={onSave}
                disabled={isCreating}
                className="gap-1.5 cursor-pointer"
              >
                {dialogMode === "add-notes" ? (
                  <>
                    <Check className="size-3.5" />
                    {isCreating ? "Saving…" : "Save Changes"}
                  </>
                ) : (
                  <>
                    <FolderIcon className="size-3.5" />
                    {isCreating
                      ? "Creating…"
                      : selectedNoteIds.length > 0
                      ? `Create & Add ${selectedNoteIds.length} Note${selectedNoteIds.length !== 1 ? "s" : ""}`
                      : "Create Folder"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
