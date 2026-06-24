import { Clock, Notebook, Sparkles } from "lucide-react";

interface WorkspaceStatsProps {
  count: number;
  timeSaved?: number;
  insights?: number;
}

export function WorkspaceStats({
  count,
  timeSaved = 0,
  insights = 0,
}: WorkspaceStatsProps) {
  // Format the time saved: e.g. "1.5h", "0.1h", or "0h"
  const formattedTimeSaved =
    timeSaved === 0
      ? "0h"
      : timeSaved < 0.1
      ? "0.1h"
      : `${timeSaved.toFixed(1)}h`;

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
      </div>

      {/* Time saved */}
      <div className="rounded-xl border border-border/80 bg-card px-4 py-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="size-4" />
          <span className="text-xs font-medium">Time saved</span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          {formattedTimeSaved}
        </p>
      </div>

      {/* Insights */}
      <div className="rounded-xl border border-border/80 bg-card px-4 py-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sparkles className="size-4" />
          <span className="text-xs font-medium">Insights</span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          {insights}
        </p>
      </div>
    </div>
  );
}