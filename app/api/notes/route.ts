import { NextResponse } from "next/server";
import { ParseError } from "@/lib/parse/formats/pdf";
import { handleCreateNote } from "@/lib/notes/createNotePipeline";
import { getNotes } from "@/lib/notes/getNotes";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    const noteId = await handleCreateNote(file);

    return NextResponse.json({ success: true, noteId });

    
  } catch (error) {
    // PDF parse errors (wrong file type, page limit, scanned PDF, etc.)
    if (error instanceof ParseError) {
      return NextResponse.json(
        {
          success: false,
          error: { code: error.code, message: error.message },
        },
        { status: 422 }
      );
    }

    const err = error as any;
    const rawMessage: string = err?.message ?? "";

    // Gemini model overloaded / quota exhausted
    const isAIOverloaded =
      rawMessage.toLowerCase().includes("overloaded") ||
      rawMessage.toLowerCase().includes("503") ||
      rawMessage.toLowerCase().includes("quota") ||
      rawMessage.toLowerCase().includes("resource has been exhausted");

    if (isAIOverloaded) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "AI_OVERLOADED",
            message:
              "The AI model is currently under high load. Please wait a moment and try again.",
          },
        },
        { status: 503 }
      );
    }

    // Precheck errors (INVALID_FILE, PAGE_LIMIT_EXCEEDED) come through as plain
    // Errors with a .code property (set via Object.assign in createNotePipeline)
    const errCode: string = err?.code || "PARSE_FAILED";

    return NextResponse.json(
      {
        success: false,
        error: {
          code: errCode,
          message:
            rawMessage ||
            "An unexpected error occurred while processing your document.",
        },
      },
      { status: errCode === "PAGE_LIMIT_EXCEEDED" || errCode === "INVALID_FILE" ? 422 : 500 }
    );
  }
}

export async function GET() {
  try {
    const notes = await getNotes(20);
    return NextResponse.json({ success: true, notes });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "FETCH_FAILED",
          message: "An unexpected error occurred while fetching notes.",
        },
      },
      { status: 500 }
    );
  }
}