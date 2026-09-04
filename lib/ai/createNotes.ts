import "server-only";
import { prisma } from "../prisma";
import { getGeminiModel } from "./gemini";
import { AppError } from "../errors";
import { USAGE } from "../usage/config";
import { NoteStyle } from "@/types/note";
import { NOTE_STYLE_PROMPTS } from "./prompts";

function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s(.+)/m);
  return match?.[1]?.trim() || "Untitled Note";
}

export async function createNote(
  text: string,
  userId: string,
  style: NoteStyle = "standard"
): Promise<string> {
  if (!text || text.trim().length < 20) {
    throw new AppError(
      "INVALID_REQUEST",
      "The document text is too short or empty. Please upload a file with more content."
    );
  }

  if (text.length > USAGE.MAX_TEXT_LENGTH) {
    throw new AppError(
      "TEXT_TOO_LONG",
      `Document text is too long (${text.length.toLocaleString()} characters). Please upload a shorter document or split it into sections.`
    );
  }

  const stylePrompt = NOTE_STYLE_PROMPTS[style] || NOTE_STYLE_PROMPTS.standard;
  const fullPrompt = `${stylePrompt}\n\nDOCUMENT CONTENT:\n${text}`;

  let output: string;
  try {
    const model = getGeminiModel();
    const result = await model.generateContent(fullPrompt);
    output = result.response.text();
  } catch (geminiError: unknown) {
    const status =
      (geminiError as { status?: number })?.status ??
      (geminiError as { httpStatus?: number })?.httpStatus;

    if (status === 429 || status === 503) {
      throw new AppError(
        "AI_OVERLOADED",
        "The AI model is currently under high load. Please wait a moment and try again."
      );
    }

    throw new AppError(
      "GENERATION_FAILED",
      "The AI failed to generate notes. Please try again."
    );
  }

  if (!output) {
    throw new AppError(
      "GENERATION_FAILED",
      "The AI returned an empty response. Please try again."
    );
  }

  const title = extractTitle(output);

  const note = await prisma.note.create({
    data: {
      title,
      sourceText: text,
      generated: output,
      userId,
      characters: text.length,
      folderId: null,
    },
  });

  return note.id;
}
