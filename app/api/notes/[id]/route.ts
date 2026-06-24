import { deleteNote } from "@/lib/notes/deleteNote";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // In the future, when auth is added:
    // const session = await getSession(request); // or similar auth check
    // const userId = session?.user?.id;
    // if (!userId) {
    //   return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    // }

    await deleteNote(id);

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
