"use client";

import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

    const deletePromise = axios
      .delete(`/api/notes/${note.id}`)
      .then(() => {
        router.push("/workspace/notes");
        router.refresh();
      });

    sileo.promise(deletePromise, {
      loading: { title: "Deleting note..." },
      success: { title: "Note deleted successfully!" },
      error: (err: unknown) => {
        const code: string | undefined = axios.isAxiosError(err)
          ? err.response?.data?.error?.code
          : undefined;

        if (code === "INVALID_DOCUMENT") {
          return {
            title: "Note not found",
            description: "This note may have already been deleted.",
          };
        }

        if (code === "UNAUTHORIZED") {
          return {
            title: "Not authorised",
            description: "You don't have permission to delete this note.",
          };
        }

        return {
          title: "Failed to delete note",
          description: "An unexpected error occurred. Please try again.",
        };
      },
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
        <p className="mb-8 text-sm text-muted-foreground">
          {new Date(note.createdAt).toLocaleDateString()}
        </p>

        <article className="max-w-none overflow-x-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
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
                <strong
                  className="font-semibold text-foreground"
                  {...props}
                />
              ),

              blockquote: ({ ...props }) => (
                <blockquote
                  className="my-4 border-l-4 border-border pl-4 italic text-muted-foreground"
                  {...props}
                />
              ),

              code: ({ className, ...props }) => (
                <code
                  className={`rounded bg-muted px-1.5 py-0.5 text-sm ${className ?? ""}`}
                  {...props}
                />
              ),

              hr: ({ ...props }) => (
                <hr
                  className="my-8 border-border"
                  {...props}
                />
              ),

              table: ({ ...props }) => (
                <table
                  className="my-6 w-full border-collapse text-sm"
                  {...props}
                />
              ),

              thead: ({ ...props }) => (
                <thead
                  className="bg-muted"
                  {...props}
                />
              ),

              tbody: ({ ...props }) => (
                <tbody {...props} />
              ),

              tr: ({ ...props }) => (
                <tr
                  className="border-b border-border"
                  {...props}
                />
              ),

              th: ({ ...props }) => (
                <th
                  className="border border-border px-4 py-2 text-left font-semibold"
                  {...props}
                />
              ),

              td: ({ ...props }) => (
                <td
                  className="border border-border px-4 py-2 align-top text-muted-foreground"
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