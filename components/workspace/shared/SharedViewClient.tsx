"use client";

import { useState } from "react";
import Link from "next/link";
import NoteCard from "@/components/workspace/notes/NoteCard";
import { Folder as FolderIcon, NotebookPen, Search, Share2, UserCheck, Link2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Folder, Note } from "@/types/note";

interface SharedViewClientProps {
  ownedNotes: Note[];
  receivedNotes: Note[];
  ownedFolders: any[];
  receivedFolders: any[];
  userFolders: Folder[];
}

export default function SharedViewClient({
  ownedNotes,
  receivedNotes,
  ownedFolders,
  receivedFolders,
  userFolders,
}: SharedViewClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filterText = searchQuery.toLowerCase().trim();

  const [recFolders, setRecFolders] = useState(receivedFolders);
  const [recNotes, setRecNotes] = useState(receivedNotes);

  const handleRemoveAccess = async (shareId: string, type: "note" | "folder") => {
    try {
      if (type === "folder") {
        setRecFolders((prev) => prev.filter((f) => f.id !== shareId));
      } else {
        setRecNotes((prev) => prev.filter((n) => n.share?.id !== shareId && n.id !== shareId));
      }
      await fetch("/api/notes/shared/count", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shareId, type }),
      });
    } catch (err) {
      console.error("Failed to remove shared access:", err);
    }
  };

  const filteredReceivedNotes = recNotes.filter(
    (n) =>
      !filterText ||
      n.title?.toLowerCase().includes(filterText) ||
      n.generated?.toLowerCase().includes(filterText)
  );

  const filteredOwnedNotes = ownedNotes.filter(
    (n) =>
      !filterText ||
      n.title?.toLowerCase().includes(filterText) ||
      n.generated?.toLowerCase().includes(filterText)
  );

  const filteredReceivedFolders = recFolders.filter(
    (f) => !filterText || f.folder?.name?.toLowerCase().includes(filterText)
  );

  const filteredOwnedFolders = ownedFolders.filter(
    (f) => !filterText || f.folder?.name?.toLowerCase().includes(filterText)
  );

  const hasAnyShared =
    ownedNotes.length > 0 ||
    recNotes.length > 0 ||
    ownedFolders.length > 0 ||
    recFolders.length > 0;


  return (
    <main className="w-full px-6 md:px-10 py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight">
            <Share2 className="size-6 text-primary" />
            Shared Workspace
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Notes and folders shared with you or created by you.
          </p>
        </div>

        {hasAnyShared && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search shared items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
        )}
      </div>

      {!hasAnyShared ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <Share2 className="mx-auto size-10 text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-semibold">No shared items yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
            Notes and folders you share or access via valid share links will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Shared with Me - Folders */}
          {filteredReceivedFolders.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                <UserCheck className="size-4 text-primary" />
                <h2 className="text-base font-semibold">Folders Shared with Me</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filteredReceivedFolders.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex items-center justify-between rounded-xl border bg-card p-4 hover:-translate-y-0.5 hover:shadow-xs transition-all cursor-pointer"
                  >
                    <Link
                      href={`/share/folder/${item.token}`}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                        <FolderIcon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold group-hover:text-primary transition-colors truncate">
                          {item.folder.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          Shared by {item.folder.user?.name || "User"} · {item.folder._count?.notes || 0} notes
                        </p>
                      </div>
                    </Link>
                    <button
                      title="Remove from my shared list"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleRemoveAccess(item.id, "folder");
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-muted text-muted-foreground hover:text-destructive rounded-md transition-all ml-2"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Shared with Me - Notes */}
          {filteredReceivedNotes.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                <NotebookPen className="size-4 text-primary" />
                <h2 className="text-base font-semibold">Notes Shared with Me</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filteredReceivedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    folders={userFolders}
                    isSharedWithMe
                    onDeleteNote={(noteId, e) => {
                      e.stopPropagation();
                      if (note.share?.id) {
                        handleRemoveAccess(note.share.id, "note");
                      }
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Shared by Me - Folders */}
          {filteredOwnedFolders.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                <Link2 className="size-4 text-muted-foreground" />
                <h2 className="text-base font-semibold">Folders Shared by Me</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filteredOwnedFolders.map((item) => (
                  <Link
                    key={item.id}
                    href={`/workspace/notes?folderId=${item.folder.id}`}
                    className="group flex items-center justify-between rounded-xl border bg-card p-4 hover:-translate-y-0.5 hover:shadow-xs transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <FolderIcon className="size-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                          {item.folder.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {item.folder._count?.notes || 0} notes · {item.viewCount} views
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Shared by Me - Notes */}
          {filteredOwnedNotes.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                <Link2 className="size-4 text-muted-foreground" />
                <h2 className="text-base font-semibold">Notes Shared by Me</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filteredOwnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    folders={userFolders}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
