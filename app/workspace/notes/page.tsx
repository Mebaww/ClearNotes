import { NotebookPen } from "lucide-react"

export default function NotesPage() {
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

        <div className="mt-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card px-6 py-16 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <NotebookPen className="size-4" />
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">No notes yet</p>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            Upload a document from Home to generate your first set of notes.
          </p>
        </div>
      </div>
    </main>
  )
}
