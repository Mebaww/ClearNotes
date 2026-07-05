import { auth } from "@/lib/auth";
import { deleteFolder } from "@/lib/notes/deleteFolder";
import { prisma } from "@/lib/prisma";
import { ok, apiErr, handleError } from "@/lib/api-response";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in to delete folders.");
    }

    const { id } = await params;

    await deleteFolder(id, session.user.id);
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
      headers: request.headers,
    });

    if (!session) {
      return apiErr("UNAUTHORIZED", "You must be signed in to rename folders.");
    }

    const { id } = await params;
    const { name } = await request.json();

    const trimmedName = name?.trim();
    if (!trimmedName) {
      return apiErr("INVALID_REQUEST", "Folder name cannot be empty.");
    }

    // Verify folder ownership
    const folder = await prisma.folder.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!folder) {
      return apiErr("INVALID_REQUEST", "Folder not found.");
    }

    // Check if name is already taken (case-insensitive)
    const existing = await prisma.folder.findFirst({
      where: {
        userId: session.user.id,
        name: { equals: trimmedName, mode: "insensitive" },
        NOT: { id },
      },
    });

    if (existing) {
      return apiErr(
        "INVALID_REQUEST",
        "A folder with this name already exists."
      );
    }

    const updated = await prisma.folder.update({
      where: { id },
      data: { name: trimmedName },
    });

    return ok({ folder: updated });
  } catch (error) {
    return handleError(error);
  }
}
