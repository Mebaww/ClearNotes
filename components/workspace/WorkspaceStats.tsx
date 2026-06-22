import { Clock, Notebook, Sparkles } from "lucide-react";

export async  function  WorkspaceStats({ count }: { count: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
      {/* Notes */}
      <div className="rounded-xl border border-border/80 bg-card px-4 py-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Notebook className="size-4" />
          <span className="text-xs font-medium">Notes</span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          {count}
        </p>
        {/* <p className="mt-0.5 text-xs text-muted-foreground">
          +3 this week
        </p> */}
      </div>

      {/* Time saved */}
      <div className="rounded-xl border border-border/80 bg-card px-4 py-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-4" />
          <span className="text-xs font-medium">Time saved</span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          1.5h
        </p>
        {/* <p className="mt-0.5 text-xs text-muted-foreground">
          This month
        </p> */}
      </div>

      {/* Insights */}
      <div className="rounded-xl border border-border/80 bg-card px-4 py-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sparkles className="size-4" />
          <span className="text-xs font-medium">Insights</span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          128
        </p>
        {/* <p className="mt-0.5 text-xs text-muted-foreground">
          All documents
        </p> */}
      </div>
    </div>
  );
}