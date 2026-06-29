import { getNoteById } from "@/lib/notes/getNoteById";
import NoteViewer from "@/components/workspace/notes/NoteViewer";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotePage({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const { id } = await params;

  const note = await getNoteById(id, session.user.id);

  if (!note) {
    console.log(`Note with ID ${id} not found.`);
    return (
      <div className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Note Not Found
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The note you are looking for does not exist or has been deleted.
        </p>
      </div>
    );
  }

  return <NoteViewer note={note} />;
}