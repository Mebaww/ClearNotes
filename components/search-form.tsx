"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SearchIcon } from "lucide-react"

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <div className="relative">
        <Label htmlFor="workspace-search" className="sr-only">
          Search notes
        </Label>
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground/70" />
        <Input
          id="workspace-search"
          placeholder="Search notes..."
          className="h-9 border-transparent bg-muted/60 pl-9 shadow-none focus-visible:border-input focus-visible:bg-background"
        />
      </div>
    </form>
  )
}
