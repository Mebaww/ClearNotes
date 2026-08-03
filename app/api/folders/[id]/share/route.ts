import { auth } from "@/lib/auth";
import { ok, apiErr, handleError } from "@/lib/api-response";
import {
  getFolderShareInfo,
  createOrUpdateFolderShareLink,
  revokeFolderShareLink,
  regenerateFolderShareToken,
} from "@/lib/notes/shareFolder";

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
    const share = await getFolderShareInfo(id, session.user.id);

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
    const share = await createOrUpdateFolderShareLink(id, session.user.id);

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
    const share = await revokeFolderShareLink(id, session.user.id);

    return ok({ share });
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
      headers: request.headers,
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in.");
    }

    const { id } = await params;
    const share = await regenerateFolderShareToken(id, session.user.id);

    return ok({ share });
  } catch (error) {
    return handleError(error);
  }
}
