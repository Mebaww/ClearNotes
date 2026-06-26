import { deleteNote } from "@/lib/notes/deleteNote";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await deleteNote(id, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete note:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "DELETE_FAILED",
          message: "An unexpected error occurred while deleting the note.",
        },
      },
      { status: 500 }
    );
  }
}
