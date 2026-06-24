import { NextResponse } from "next/server";
import { ParseError } from "@/lib/parse/formats/pdf";
import { handleCreateNote } from "@/lib/notes/createNotePipeline";
import { getNotes } from "@/lib/notes/getNotes";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_REQUEST", message: "Missing document text" } },
        { status: 400 }
      );
    }

    const noteId = await handleCreateNote(text);

    return NextResponse.json({ success: true, noteId });
  } catch (error) {
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
            message: "The AI model is currently under high load. Please wait a moment and try again.",
          },
        },
        { status: 503 }
      );
    }

    const errCode: string = err?.code ?? "GENERATION_FAILED";

    return NextResponse.json(
      {
        success: false,
        error: {
          code: errCode,
          message: rawMessage || "An unexpected error occurred while generating notes.",
        },
      },
      { status: errCode === "TEXT_TOO_LONG" ? 422 : 500 }
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