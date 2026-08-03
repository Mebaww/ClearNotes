import { auth } from "@/lib/auth";
import { ok, apiErr, handleError } from "@/lib/api-response";
import { getUserSharedNotesCount } from "@/lib/notes/shareNote";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in.");
    }

    const count = await getUserSharedNotesCount(session.user.id);

    return ok({ count });
  } catch (error) {
    return handleError(error);
  }
}
