import { deleteNote } from "@/lib/notes/deleteNote";
import { updateNoteFolder } from "@/lib/notes/updateNoteFolder";
import { auth } from "@/lib/auth";
import { ok, apiErr, handleError } from "@/lib/api-response";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in to delete notes.");
    }

    const { id } = await params;

    await deleteNote(id, session.user.id);

    return ok({});
  } catch (error) {
    return handleError(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in to update notes.");
    }

    const { id } = await params;
    const { folderId } = await request.json();

    const note = await updateNoteFolder(id, folderId || null, session.user.id);

    return ok({ note });
  } catch (error) {
    return handleError(error);
  }
}
