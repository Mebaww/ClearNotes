"use client";

import ReactMarkdown from "react-markdown";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Note } from "@/types/note";
import { Button } from "@/components/ui/button";
import { sileo } from "sileo";

interface Props {
  note: Note;
}

export default function NoteViewer({ note }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    const deletePromise = fetch(`/api/notes/${note.id}`, {
      method: "DELETE",
    }).then(async (res) => {
      if (!res.ok) {
        throw new Error("Failed to delete note");
      }
      router.push("/workspace/notes");
      router.refresh();
    });

    sileo.promise(deletePromise, {
      loading: { title: "Deleting note..." },
      success: { title: "Note deleted successfully!" },
      error: { title: "Failed to delete note." },
    });
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => router.push("/workspace/notes")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Notes
        </button>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="flex items-center gap-1.5"
        >
          <Trash2 className="size-3" />
          Delete Note
        </Button>
      </div>

      <div className="rounded-xl border bg-card p-8">
        <h1 className="mb-2 text-3xl font-bold">
          {note.title}
        </h1>

        <p className="mb-8 text-sm text-muted-foreground">
          {new Date(note.createdAt).toLocaleDateString()}
        </p>

        <article className="max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ ...props }) => (
                <h1
                  className="mt-8 mb-4 text-3xl font-bold tracking-tight"
                  {...props}
                />
              ),
              h2: ({ ...props }) => (
                <h2
                  className="mt-8 mb-3 border-b pb-2 text-2xl font-semibold"
                  {...props}
                />
              ),
              h3: ({ ...props }) => (
                <h3
                  className="mt-6 mb-2 text-xl font-semibold"
                  {...props}
                />
              ),
              p: ({ ...props }) => (
                <p
                  className="mb-4 leading-7 text-muted-foreground"
                  {...props}
                />
              ),
              ul: ({ ...props }) => (
                <ul
                  className="mb-4 list-disc space-y-2 pl-6"
                  {...props}
                />
              ),
              ol: ({ ...props }) => (
                <ol
                  className="mb-4 list-decimal space-y-2 pl-6"
                  {...props}
                />
              ),
              li: ({ ...props }) => (
                <li
                  className="leading-7 text-muted-foreground"
                  {...props}
                />
              ),
              strong: ({ ...props }) => (
                <strong className="font-semibold text-foreground" {...props} />
              ),
              blockquote: ({ ...props }) => (
                <blockquote
                  className="my-4 border-l-4 pl-4 italic text-muted-foreground"
                  {...props}
                />
              ),
              code: ({ ...props }) => (
                <code
                  className="rounded bg-muted px-1.5 py-0.5 text-sm"
                  {...props}
                />
              ),
            }}
          >
            {note.generated ?? ""}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}