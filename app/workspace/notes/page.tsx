import { Metadata } from "next";
import NotesList from "@/components/workspace/notes/Notes-List";
import {Note} from "@/types/note";
import { getNotes } from "@/lib/notes/getNotes";

export const metadata: Metadata = {
  title: "Notes | ClearNotes",
  description: "All your generated notes in one place.",
};


export default async function NotesPage() {
  const notes = await getNotes();

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
        <NotesList initialNotes={notes} />
      </div>
    </main>
  );
}