import { ArrowUpRight, Notebook } from "lucide-react";

type RecentDocument = {
  id?: string;
  title: string | null;
  createdAt: Date | null;
  summary: string | null;
};

function formatDate(date: Date | null) {
  if (!date) return "Unknown";

  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function RecentDocuments({
  documents = [],
}: {
  documents?: RecentDocument[];
}) {
  return (
    <section className="flex h-full flex-col rounded-xl border border-border/80 bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-border/60 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Recent notes
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Continue reading your latest summaries
          </p>
        </div>

        <button className="text-xs font-medium text-primary transition-colors hover:text-primary/80">
          View all
        </button>
      </div>

      <div className="divide-y divide-border/60">
        {documents.map((doc, idx) => (
          <button
            key={doc.id ?? idx}
            type="button"
            className="group flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/40"
          >
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
              <Notebook className="size-4" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">
                  {doc.title ?? "Untitled Note"}
                </p>

                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {formatDate(doc.createdAt)}
                </span>
              </div>

              <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                {doc.summary ?? "No summary available"}
              </p>
            </div>

            <ArrowUpRight className="mt-1 size-3.5 shrink-0 text-muted-foreground/0 transition-all group-hover:text-muted-foreground" />
          </button>
        ))}
      </div>
    </section>
  );
}