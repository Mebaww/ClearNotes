import { handleCreateNote } from "@/lib/notes/createNotePipeline";
import { getNotes } from "@/lib/notes/getNotes";
import { auth } from "@/lib/auth";
import { ok, apiErr, handleError } from "@/lib/api-response";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in to generate notes.");
    }

    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return apiErr("INVALID_REQUEST", "Missing or invalid document text.");
    }

    const noteId = await handleCreateNote(text, session.user.id);

    return ok({ noteId });
  } catch (error) {
    return handleError(error);
  }
}

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in to view notes.");
    }

    const notes = await getNotes(session.user.id, 20);
    return ok({ notes });
  } catch (error) {
    return handleError(error);
  }
}