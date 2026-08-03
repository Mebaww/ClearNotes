import { auth } from "@/lib/auth";
import { ok, apiErr, handleError } from "@/lib/api-response";
import { getUserSharedNotesCount } from "@/lib/notes/shareNote";
import { getUserSharedFoldersCount } from "@/lib/notes/shareFolder";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in.");
    }

    const notesCount = await getUserSharedNotesCount(session.user.id);
    const foldersCount = await getUserSharedFoldersCount(session.user.id);

    return ok({ count: notesCount + foldersCount });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in.");
    }

    const { shareId, type } = await request.json();
    if (!shareId) {
      return apiErr("INVALID_REQUEST", "shareId is required");
    }

    if (type === "folder") {
      const { removeUserFolderAccess } = await import("@/lib/notes/shareFolder");
      await removeUserFolderAccess(session.user.id, shareId);
    } else {
      const { removeUserNoteAccess } = await import("@/lib/notes/shareNote");
      await removeUserNoteAccess(session.user.id, shareId);
    }

    return ok({ success: true });
  } catch (error) {
    return handleError(error);
  }
}


