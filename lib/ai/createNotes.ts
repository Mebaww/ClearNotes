import "server-only";
import { prisma } from "../prisma";
import { geminiModel } from "./gemini";
import { AppError } from "../errors";
import { USAGE } from "../usage/config";


import { NoteStyle } from "@/types/note";
import { NOTE_STYLE_PROMPTS } from "./prompts";

function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s(.+)/m);
  return match?.[1]?.trim() || "Untitled Note";
}

export async function createNote(text: string, userId: string, style: NoteStyle = "standard") {
  if (!text || text.trim().length < 20) {
    throw new AppError(
      "INVALID_REQUEST",
      "The document text is too short or empty. Please upload a file with more content."
    );
  }

  // Guard against excessively large documents that would saturate Gemini's context
  if (text.length > USAGE.MAX_TEXT_LENGTH) {
    throw new AppError(
      "TEXT_TOO_LONG",
      `Document text is too long (${text.length.toLocaleString()} characters). Please upload a shorter document or split it into sections.`
    );
  }

  // Assemble the prompt: selected style instructions followed by the document text
  const stylePrompt = NOTE_STYLE_PROMPTS[style] || NOTE_STYLE_PROMPTS.standard;
  const fullPrompt = `${stylePrompt}\n\nDOCUMENT CONTENT:\n${text}`;

  // Wrap the Gemini call so SDK errors are converted using the HTTP status
  // code — never by message string matching.
  let output: string;
  try {
    const result = await geminiModel.generateContent(fullPrompt);
    output = result.response.text();
  } catch (geminiError: unknown) {
    // The Google Generative AI SDK surfaces HTTP status on the error object.
    // 429 = quota / rate limit, 503 = model overloaded.
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

  // extract title from AI markdown
  const title = extractTitle(output);

  const note = await prisma.note.create({
    data: {
      title,
      sourceText: text,
      generated: output,
      userId: userId,
      characters: text.length,
      folderId: null,
    },
  });

  return note.id;
}
