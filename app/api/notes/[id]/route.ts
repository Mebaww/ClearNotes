import { deleteNote } from "@/lib/notes/deleteNote";
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
