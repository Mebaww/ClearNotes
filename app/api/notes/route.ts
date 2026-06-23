import { NextResponse } from "next/server";
import { ValidateFile, ParseError } from "@/lib/parse/formats/pdf";
import { createNote } from "@/lib/ai/createNotes";
import { prisma } from "@/lib/prisma";

const PAGE_LIMIT = 20;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_FILE", message: "No file was provided." },
        },
        { status: 400 },
      );
    }

    // Convert file to buffer once at the entry point
    const arrayBuffer = await file.arrayBuffer();

    // Fast validation on raw bytes before invoking heavy parser logic
    const precheck = ValidateFile(arrayBuffer, PAGE_LIMIT);
    if (!precheck.valid) {
      return NextResponse.json(
        { success: false, error: precheck.error },
        { status: 422 },
      );
    }

    // Process notes using the pre-validated buffer
    const noteId = await createNote(arrayBuffer);

    return NextResponse.json({ success: true, noteId });
  } catch (error) {
    if (error instanceof ParseError) {
      return NextResponse.json(
        { success: false, error: { code: error.code, message: error.message } },
        { status: 422 },
      );
    }

    console.error("CleanNotes generation pipeline failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "PARSE_FAILED",
          message:
            "An unexpected error occurred while processing your document.",
        },
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ success: true, notes });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_FAILED",
          message: "An unexpected error occurred while fetching notes.",
        },
      },
      { status: 500 },
    );
  }
}
