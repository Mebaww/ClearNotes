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

