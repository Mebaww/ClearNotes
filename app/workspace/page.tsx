import { DocumentUploader } from "@/components/workspace/DocumentUploader";
import { RecentDocuments } from "@/components/workspace/RecentDocuments";
import { WorkspaceStats } from "@/components/workspace/WorkspaceStats";
import { getStats } from "@/lib/notes/getStats";

export const dynamic = "force-dynamic";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function WorkspacePage() {
  const { count, recent, timeSaved, insights } = await getStats();

  return (
    <main className="w-full min-w-0 flex-1">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8 md:py-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-[1.75rem]">
            {getGreeting()}, Mebaw
          </h1>
          <p className="text-sm text-muted-foreground">
            Upload a document to generate notes, or pick up where you left off.
          </p>
        </div>

        <div className="mt-8">
          <WorkspaceStats count={count} timeSaved={timeSaved} insights={insights} />
        </div>
        <div className="mt-8 grid w-full gap-6 lg:grid-cols-5 lg:gap-8">
          <div className="min-w-0 lg:col-span-2">
            <DocumentUploader />
          </div>
          <div className="min-w-0 lg:col-span-3">
            <RecentDocuments documents={recent} />
          </div>
        </div>
      </div>
    </main>
  );
}
