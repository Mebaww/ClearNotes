import { getSharedFolderByToken } from "@/lib/notes/shareFolder";
import { Metadata } from "next";
import { EyeOff } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import NoteViewer from "@/components/workspace/notes/NoteViewer";
import { Note } from "@/types/note";

export const revalidate = 0;

interface Props {
  params: Promise<{ token: string; noteId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token, noteId } = await params;
  try {
    const sharedFolder = await getSharedFolderByToken(token, undefined, false);
    if (!sharedFolder) {
      return { title: "Note Not Found - ClearNotes", robots: { index: false, follow: false } };
    }
    const note = sharedFolder.notes.find((n: any) => n.id === noteId);
    return {
      title: `${note?.title || "Untitled Note"} - ${sharedFolder.name} | ClearNotes`,
      robots: { index: false, follow: false },
    };
  } catch {
    return { title: "Shared Note - ClearNotes", robots: { index: false, follow: false } };
  }
}

export default async function SharedFolderNotePage({ params }: Props) {
  const { token, noteId } = await params;

  const session = await auth.api.getSession({ headers: await headers() });

  let sharedFolder: Awaited<ReturnType<typeof getSharedFolderByToken>> = null;
  try {
    // Don't record folder access again just for opening a note inside it
    sharedFolder = await getSharedFolderByToken(token, undefined, false);
  } catch (err) {
    console.error("[share/folder/note] DB error:", err);
  }

  if (!sharedFolder) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <EyeOff className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold tracking-tight mb-2">Folder Unavailable</h1>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          This shared folder link may have expired or been revoked.
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

  const rawNote = sharedFolder.notes.find((n: any) => n.id === noteId);

  if (!rawNote) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <EyeOff className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold tracking-tight mb-2">Note Not Found</h1>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          This note no longer exists in the shared folder.
        </p>
        <Link
          href={`/share/folder/${token}`}
          className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Back to Folder
        </Link>
      </div>
    );
  }

  const note: Note = {
    id: rawNote.id,
    title: rawNote.title ?? null,
    sourceText: null,
    generated: rawNote.generated ?? null,
    folderId: null,
    folder: null,
    share: null,
    createdAt: new Date(rawNote.createdAt),
    updatedAt: new Date(rawNote.updatedAt),
  };

  const backUrl = `/share/folder/${token}`;

  return (
    <NoteViewer
      note={note}
      isReadOnly={true}
      backHref={backUrl}
    />
  );
}



