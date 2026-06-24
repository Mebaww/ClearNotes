import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-svh [--header-height:calc(--spacing(12))]">
      <TooltipProvider>
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1 overflow-hidden">
            <AppSidebar />
            <div className="flex flex-1 flex-col min-w-0 overflow-auto">
              {children}
            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </div>
  );
}
