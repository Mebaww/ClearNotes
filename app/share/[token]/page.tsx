import { getSharedNoteByToken } from "@/lib/notes/shareNote";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EyeOff } from "lucide-react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import NoteViewer from "@/components/workspace/notes/NoteViewer";
import { Note } from "@/types/note";

export const revalidate = 0; // Always fresh — link revocation must take effect immediately

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  try {
    const sharedData = await getSharedNoteByToken(token, undefined, false);
    if (!sharedData) {
      return {
        title: "Shared Note Not Found - ClearNotes",
        robots: { index: false, follow: false },
      };
    }
    return {
      title: `${sharedData.title || "Untitled Note"} - ClearNotes Share`,
      description:
        sharedData.generated?.slice(0, 160) || "Shared study note from ClearNotes",
      robots: { index: false, follow: false },
      openGraph: {
        title: sharedData.title || "Untitled Note",
        description:
          sharedData.generated?.slice(0, 160) || "Shared study note from ClearNotes",
        siteName: "ClearNotes",
      },
    };
  } catch {
    return {
      title: "Shared Note - ClearNotes",
      robots: { index: false, follow: false },
    };
  }
}

export default async function SharedNotePage({ params }: Props) {
  const { token } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  let sharedData: Awaited<ReturnType<typeof getSharedNoteByToken>> = null;
  try {
    sharedData = await getSharedNoteByToken(token, session?.user?.id);
  } catch (err) {
    console.error("[share/token] DB error fetching shared note:", err);
  }

  if (!sharedData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <EyeOff className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold tracking-tight mb-2">Note Unavailable</h1>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          This shared link may have expired, been revoked by the owner, or deleted.
        </p>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <Link
              href="/workspace"
              className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Back to Workspace
            </Link>
          ) : (
            <Link
              href="/"
              className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Go to ClearNotes Home
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Build a minimal Note shape compatible with NoteViewer
  const note: Note = {
    id: sharedData.id,
    title: sharedData.title,
    sourceText: null,
    generated: sharedData.generated,
    folderId: null,
    folder: null,
    share: null,
    createdAt: new Date(sharedData.createdAt),
    updatedAt: new Date(sharedData.updatedAt),
  };

  const isOwner = session?.user?.id === sharedData.ownerId;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Slim public header — only shown for non-owners / guests */}
      {!isOwner && (
        <header className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-10 px-6 py-3 flex items-center justify-between">
          <Link href={session?.user ? "/workspace" : "/"} className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="ClearNotes" width={22} height={22} />
            <span className="text-sm font-semibold tracking-tight">ClearNotes</span>
          </Link>
          <span className="rounded-full bg-secondary/80 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
            Shared Read-Only Note
          </span>
        </header>
      )}

      {/* NoteViewer in read-only mode — shows Back button automatically */}
      <div className={isOwner ? "" : "flex-1"}>
        <NoteViewer note={note} isReadOnly={!isOwner} />
      </div>

      {/* Footer for non-owner guests */}
      {!isOwner && (
        <footer className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground">
          Generated and shared with{" "}
          <Link href="/" className="font-medium text-foreground underline hover:opacity-80">
            ClearNotes
          </Link>
        </footer>
      )}
    </div>
  );
}
