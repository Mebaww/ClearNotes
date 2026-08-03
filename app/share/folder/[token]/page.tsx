import { getSharedFolderByToken } from "@/lib/notes/shareFolder";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Folder, Calendar, EyeOff, NotebookPen } from "lucide-react";
import NoteCard from "@/components/workspace/notes/NoteCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const revalidate = 0;

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const sharedData = await getSharedFolderByToken(token, undefined, false);

  if (!sharedData) {
    return {
      title: "Shared Folder Not Found - ClearNotes",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${sharedData.name || "Untitled Folder"} - ClearNotes Shared Folder`,
    description: `Shared study folder containing ${sharedData.notes.length} note(s) from ClearNotes`,
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: `${sharedData.name} - Shared Folder`,
      description: `Shared study folder with ${sharedData.notes.length} note(s)`,
      siteName: "ClearNotes",
    },
  };
}

export default async function SharedFolderPage({ params }: Props) {
  const { token } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let sharedData: Awaited<ReturnType<typeof getSharedFolderByToken>> = null;
  try {
    sharedData = await getSharedFolderByToken(token, session?.user?.id);
  } catch (err) {
    console.error("[share/folder] DB error:", err);
  }

  if (!sharedData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <EyeOff className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold tracking-tight mb-2">Folder Unavailable</h1>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          This shared folder link may have expired, been revoked by the owner, or deleted.
        </p>
        <Link
          href={session?.user ? "/workspace" : "/"}
          className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          {session?.user ? "Back to Workspace" : "Go to ClearNotes Home"}
        </Link>
      </div>
    );
  }

  const isGuest = !session?.user;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Public header only for guests — logged-in users have the sidebar header */}
      {isGuest && (
        <header className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-10 px-6 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="ClearNotes" width={24} height={24} />
            <span className="text-sm font-semibold tracking-tight">ClearNotes</span>
          </Link>
          <span className="rounded-full bg-secondary/80 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
            Shared Folder · Read-Only
          </span>
        </header>
      )}

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-8 border-b border-border/40 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Folder className="size-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{sharedData.name}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Shared by {sharedData.ownerName} · {sharedData.notes.length}{" "}
                {sharedData.notes.length === 1 ? "note" : "notes"}
              </p>
            </div>
          </div>
        </div>

        {sharedData.notes.length === 0 ? (
          <div className="rounded-xl border border-dashed p-12 text-center">
            <NotebookPen className="mx-auto size-8 text-muted-foreground/40 mb-3" />
            <h3 className="text-base font-semibold">No notes in this folder</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
              The owner hasn't added any notes to this folder yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sharedData.notes.map((note: any) => (
              <NoteCard
                key={note.id}
                note={note}
                folders={[]}
                folderShareToken={token}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer for guests only */}
      {isGuest && (
        <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
          Shared with{" "}
          <Link href="/" className="font-medium text-foreground underline hover:opacity-80">
            ClearNotes
          </Link>
        </footer>
      )}
    </div>
  );
}
