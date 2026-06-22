"use client"

import { SearchForm } from "@/components/search-form"
import { ModeToggle } from "@/components/toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { Bell, PanelLeftIcon } from "lucide-react"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()

  return (
<header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
  <div className="flex h-12 w-full items-center px-4 md:px-6">
    {/* Left */}
    <div className="flex items-center gap-3">
      <Button
        className="h-8 w-8 shrink-0"
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
      >
        <PanelLeftIcon className="size-4" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      <Separator
        orientation="vertical"
        className="data-vertical:h-4 data-vertical:self-auto"
      />
    </div>
   
    <div className="flex-1 flex justify-center px-4">
      <SearchForm className="w-full max-w-xl" />
    </div>

    {/* Right */}
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground"
      >
        <Bell className="size-4" />
        <span className="sr-only">Notifications</span>
      </Button>
      <ModeToggle />
    </div>
  </div>
</header>
  )
}
