import { Clock, Notebook, Sparkles } from "lucide-react"

const stats = [
  {
    icon: Notebook,
    label: "Notes",
    value: "42",
    detail: "+3 this week",
  },
  {
    icon: Clock,
    label: "Time saved",
    value: "6.5h",
    detail: "This month",
  },
  {
    icon: Sparkles,
    label: "Insights",
    value: "128",
    detail: "All documents",
  },
]

export function WorkspaceStats() {
  return (
    <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <div
            key={stat.label}
            className="rounded-xl border border-border/80 bg-card px-4 py-4"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <Icon className="size-4" strokeWidth={2} />
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.detail}</p>
          </div>
        )
      })}
    </div>
  )
}
