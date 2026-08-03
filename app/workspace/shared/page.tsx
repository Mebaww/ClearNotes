import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserSharedNotes } from "@/lib/notes/shareNote";
import { getUserSharedFolders } from "@/lib/notes/shareFolder";
import { getFolders } from "@/lib/notes/getFolders";
import SharedViewClient from "@/components/workspace/shared/SharedViewClient";

export default async function SharedNotesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const { owned: ownedNotesData, sharedWithMe: sharedNotesData } =
    await getUserSharedNotes(session.user.id);
  const { owned: ownedFoldersData, sharedWithMe: sharedFoldersData } =
    await getUserSharedFolders(session.user.id);

  const folders = await getFolders(session.user.id);

  const ownedNotes = ownedNotesData.map((s: any) => ({
    ...s.note,
    share: {
      id: s.id,
      noteId: s.noteId,
      token: s.token,
      enabled: s.enabled,
      viewCount: s.viewCount,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    },
  }));

  const receivedNotes = sharedNotesData.map((s: any) => ({
    ...s.note,
    share: {
      id: s.id,
      noteId: s.noteId,
      token: s.token,
      enabled: s.enabled,
      viewCount: s.viewCount,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    },
  }));

  return (
    <SharedViewClient
      ownedNotes={ownedNotes}
      receivedNotes={receivedNotes}
      ownedFolders={ownedFoldersData}
      receivedFolders={sharedFoldersData}
      userFolders={folders}
    />
  );
}

