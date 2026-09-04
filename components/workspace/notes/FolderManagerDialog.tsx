"use client";

import { useState } from "react";
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

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setNoteSearch("");
      setPickerTab("add");
    }
    onOpenChange(isOpen);
  };

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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        {/* ── Step 1: Name ── */}
        {dialogStep === "name" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-base">Create a folder</DialogTitle>
              <DialogDescription>
                Give your folder a name. You&apos;ll add notes to it in the next step.
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

            <div className="space-y-4 mt-2">
              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 transition-colors group-focus-within:text-primary" />
                <Input
                  placeholder="Search notes…"
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  className="h-10 pl-9 text-sm rounded-xl bg-muted/30 border-transparent focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40 transition-all shadow-none"
                />
              </div>

              {/* Tabs for Add-Notes Mode */}
              {dialogMode === "add-notes" && (
                <div className="flex border-b border-border/40">
                  <button
                    type="button"
                    onClick={() => setPickerTab("add")}
                    className={`flex-1 pb-2.5 text-[11px] sm:text-xs font-semibold text-center border-b-2 cursor-pointer transition-colors ${
                      pickerTab === "add"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Add Notes <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium">{notes.filter(n => !selectedNoteIds.includes(n.id)).length}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickerTab("current")}
                    className={`flex-1 pb-2.5 text-[11px] sm:text-xs font-semibold text-center border-b-2 cursor-pointer transition-colors ${
                      pickerTab === "current"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    In Folder <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-medium">{selectedNoteIds.length}</span>
                  </button>
                </div>
              )}

              {/* Note list */}
              <div className="max-h-[320px] overflow-y-auto -mx-1 px-1 space-y-1.5 pr-2 scrollbar-none">
                {pickableNotes.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-border/60">
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
                        className={`w-full flex items-start gap-3.5 rounded-xl border px-3.5 py-3 text-left transition-all cursor-pointer group ${
                          isSelected
                            ? "border-primary/50 bg-primary/5 shadow-[0_1px_3px_0_rgba(184,134,59,0.05)]"
                            : "border-border/40 bg-card hover:bg-muted/40 hover:border-border/80"
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-xs"
                              : "border-input bg-background group-hover:border-primary/50"
                          }`}
                        >
                          {isSelected && <Check className="size-3" strokeWidth={3} />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className={`text-[13px] font-medium break-words line-clamp-2 leading-tight transition-colors ${isSelected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                            {note.title || "Untitled Document"}
                          </p>
                          {note.folder && note.folderId !== selectedFolderId && (
                            <p className="text-[11px] text-muted-foreground/70 mt-1.5 line-clamp-1 break-all">
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
                <p className="text-[11px] text-muted-foreground text-center font-medium">
                  {selectedNoteIds.length} note{selectedNoteIds.length !== 1 ? "s" : ""} selected
                </p>
              )}
            </div>

            <DialogFooter className="flex-col sm:flex-row sm:justify-between sm:items-center mt-6 pt-4 border-t border-border/40 gap-3 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs cursor-pointer text-muted-foreground w-full sm:w-auto order-2 sm:order-1 hover:bg-muted/50"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={onSave}
                disabled={isCreating}
                className="gap-1.5 cursor-pointer w-full sm:w-auto order-1 sm:order-2 shadow-sm font-medium transition-all"
              >
                {dialogMode === "add-notes" ? (
                  <>
                    <Check className="size-3.5" />
                    {isCreating ? "Saving…" : "Save Changes"}
                  </>
                ) : (
                  <>
                    {isCreating ? (
                      "Creating…"
                    ) : selectedNoteIds.length > 0 ? (
                      <>
                        <FolderIcon className="size-3.5" />
                        Create & Add {selectedNoteIds.length} Note{selectedNoteIds.length !== 1 ? "s" : ""}
                      </>
                    ) : (
                      "Create Empty Folder"
                    )}
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
