import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, apiErr, handleError } from "@/lib/api-response";

export async function PATCH(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in to modify notes.");
    }

    const { noteIds, folderId } = await request.json();

    if (!noteIds || !Array.isArray(noteIds)) {
      return apiErr("INVALID_REQUEST", "Missing or invalid noteIds array.");
    }

    // If folderId is provided, verify it exists and is owned by the user
    if (folderId) {
      const folder = await prisma.folder.findFirst({
        where: { id: folderId, userId: session.user.id },
      });

      if (!folder) {
        return apiErr("INVALID_REQUEST", "Folder not found.");
      }
    }

    // Perform bulk update
    await prisma.note.updateMany({
      where: {
        id: { in: noteIds },
        userId: session.user.id,
      },
      data: {
        folderId: folderId || null,
      },
    });

    return ok({});
  } catch (error) {
    return handleError(error);
  }
}
