import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserSharedNotes } from "@/lib/notes/shareNote";
import { getFolders } from "@/lib/notes/getFolders";
import NoteCard from "@/components/workspace/notes/NoteCard";
import { Share2, UserCheck, Link2 } from "lucide-react";

export default async function SharedNotesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const { owned, sharedWithMe } = await getUserSharedNotes(session.user.id);
  const folders = await getFolders(session.user.id);

  const ownedNotes = owned.map((s: any) => ({
    ...s.note,
    share: {
      id: s.id,
      noteId: s.noteId,
      token: s.token,
      enabled: s.enabled,
      viewCount: s.viewCount,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    },
  }));

  const receivedNotes = sharedWithMe.map((s: any) => ({
    ...s.note,
    share: {
      id: s.id,
      noteId: s.noteId,
      token: s.token,
      enabled: s.enabled,
      viewCount: s.viewCount,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    },
  }));


  const hasAnyShared = ownedNotes.length > 0 || receivedNotes.length > 0;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight">
            <Share2 className="size-6 text-primary" />
            Shared Notes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Access notes shared with you and manage your own public links.
          </p>
        </div>
      </div>

      {!hasAnyShared ? (
        <div className="rounded-xl border border-dashed p-12 text-center">
          <Share2 className="mx-auto size-10 text-muted-foreground/40 mb-3" />
          <h3 className="text-base font-semibold">No active shared notes</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
            Notes you share or access via valid share links will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Shared with me section */}
          {receivedNotes.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                <UserCheck className="size-4 text-primary" />
                <h2 className="text-base font-semibold">Shared with Me</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {receivedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    folders={folders}
                    isSharedWithMe
                  />
                ))}
              </div>
            </section>
          )}

          {/* Created by me section */}
          {ownedNotes.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/40 pb-2">
                <Link2 className="size-4 text-muted-foreground" />
                <h2 className="text-base font-semibold">Shared by Me</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ownedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    folders={folders}
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
