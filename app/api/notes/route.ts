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

    const { text, style } = await request.json();

    if (!text || typeof text !== "string") {
      return apiErr("INVALID_REQUEST", "Missing or invalid document text.");
    }

    const validStyle =
      style === "study" || style === "research" || style === "standard"
        ? style
        : "standard";

    const noteId = await handleCreateNote(text, session.user.id, validStyle);

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