import { auth } from "@/lib/auth";
import { getFolders } from "@/lib/notes/getFolders";
import { createFolder } from "@/lib/notes/createFolder";
import { ok, apiErr, handleError } from "@/lib/api-response";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in to view folders.");
    }

    const folders = await getFolders(session.user.id);
    return ok({ folders });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in to create folders.");
    }

    const { name } = await request.json();

    if (!name || typeof name !== "string") {
      return apiErr("INVALID_REQUEST", "Missing or invalid folder name.");
    }

    const folder = await createFolder(name, session.user.id);
    return ok({ folder });
  } catch (error) {
    return handleError(error);
  }
}
