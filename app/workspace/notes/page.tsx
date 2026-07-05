import { Metadata } from "next";
import NotesList from "@/components/workspace/notes/Notes-List";
import { getNotes } from "@/lib/notes/getNotes";
import { getFolders } from "@/lib/notes/getFolders";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notes | ClearNotes",
  description: "All your generated notes in one place.",
};

interface PageProps {
  searchParams: Promise<{
    folderId?: string;
  }>;
}

export default async function NotesPage({ searchParams }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/");
  }

  const { folderId } = await searchParams;
  const notes = await getNotes(session.user.id, 200);
  const folders = await getFolders(session.user.id);

  return (
    <main className="flex-1 overflow-auto">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]">
            Notes
          </h1>
          <p className="text-sm text-muted-foreground">
            All your generated notes in one place.
          </p>
        </div>

        {/* Dynamic Client Interactive View Layer */}
        <NotesList 
          initialNotes={notes} 
          initialFolders={folders} 
          selectedFolderId={folderId || null} 
        />
      </div>
    </main>
  );
}