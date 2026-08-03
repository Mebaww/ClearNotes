import { getSharedNoteByToken } from "@/lib/notes/shareNote";
import { notFound, redirect } from "next/navigation";

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MarkdownContent } from "@/components/workspace/notes/MarkdownContent";
import { Calendar, EyeOff } from "lucide-react";

export const revalidate = 0; // Disable static cache so link revocation takes immediate effect

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const sharedData = await getSharedNoteByToken(token, undefined, false);


  if (!sharedData) {
    return {
      title: "Shared Note Not Found - ClearNotes",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${sharedData.title || "Untitled Note"} - ClearNotes Share`,
    description: sharedData.generated?.slice(0, 160) || "Shared study note from ClearNotes",
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: sharedData.title || "Untitled Note",
      description: sharedData.generated?.slice(0, 160) || "Shared study note from ClearNotes",
      siteName: "ClearNotes",
    },
  };
}

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function SharedNotePage({ params }: Props) {
  const { token } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const sharedData = await getSharedNoteByToken(token, session?.user?.id);

  // If user is logged in, redirect them directly into their app workspace view
  if (session?.user && sharedData) {
    redirect(`/workspace/shared`);
  }



  if (!sharedData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <EyeOff className="size-8 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-bold tracking-tight mb-2">Note Unavailable</h1>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          This shared link may have expired, been revoked by the owner, or deleted.
        </p>
        <Link
          href="/"
          className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Go to ClearNotes Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Public Header */}
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-10 px-6 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="ClearNotes" width={24} height={24} />
          <span className="text-sm font-semibold tracking-tight">ClearNotes</span>
        </Link>
        <span className="rounded-full bg-secondary/80 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground">
          Shared Read-Only Note
        </span>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-4xl px-6 py-10">
        <div className="rounded-xl border bg-card p-8 shadow-xs">
          <div className="mb-6 flex items-center justify-between border-b border-border/40 pb-4">
            <h1 className="text-2xl font-bold tracking-tight">
              {sharedData.title || "Untitled Document"}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
              <Calendar className="size-3.5" />
              <span>
                {new Date(sharedData.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <MarkdownContent content={sharedData.generated || ""} />
        </div>
      </main>

      {/* Public Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        Generated and shared with{" "}
        <Link href="/" className="font-medium text-foreground underline hover:opacity-80">
          ClearNotes
        </Link>
      </footer>
    </div>
  );
}
