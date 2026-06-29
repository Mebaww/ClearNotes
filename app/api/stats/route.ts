import { getStats } from "@/lib/notes/getStats";
import { auth } from "@/lib/auth";
import { ok, apiErr, handleError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in to view stats.");
    }

    const { count, recent, timeSaved, insights } = await getStats(session.user.id);

    return ok({ count, recent, timeSaved, insights });
  } catch (error) {
    return handleError(error);
  }
}