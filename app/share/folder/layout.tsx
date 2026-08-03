import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function SharedFolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Logged-in users: render full workspace shell with sidebar
  if (session) {
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

  // Guests: no sidebar, just render the page (which has its own public header)
  return <>{children}</>;
}
