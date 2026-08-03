import { auth } from "@/lib/auth";
import { ok, apiErr, handleError } from "@/lib/api-response";
import {
  getNoteShareInfo,
  createOrUpdateShareLink,
  revokeShareLink,
  regenerateShareToken,
} from "@/lib/notes/shareNote";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in.");
    }

    const { id } = await params;
    const share = await getNoteShareInfo(id, session.user.id);

    return ok({ share });
  } catch (error) {
    return handleError(error);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in.");
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    let share;
    if (body.action === "regenerate") {
      share = await regenerateShareToken(id, session.user.id);
    } else {
      share = await createOrUpdateShareLink(id, session.user.id);
    }

    return ok({ share });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in.");
    }

    const { id } = await params;
    const share = await revokeShareLink(id, session.user.id);

    return ok({ share });
  } catch (error) {
    return handleError(error);
  }
}
