import "server-only";
import { prisma } from "../prisma";
import { geminiModel } from "./gemini";

function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s(.+)/m);
  return match?.[1]?.trim() || "Untitled Note";
}

export async function createNote(text: string) {
  if (!text || text.trim().length < 20) {
    throw new Error("Empty document text could not be extracted.");
  }

  // Guard against excessively large documents that would saturate Gemini's context
  const MAX_TEXT_LENGTH = 80_000;
  if (text.length > MAX_TEXT_LENGTH) {
    throw Object.assign(
      new Error(
        `Document text is too long (${text.length.toLocaleString()} characters). Please upload a shorter document or split it into sections.`
      ),
      { code: "TEXT_TOO_LONG" }
    );
  }


  const result = await geminiModel.generateContent(text);
  const output = result.response.text();

  if (!output) {
    throw new Error("AI returned an empty response.");
  }

  // extract title from AI markdown
  const title = extractTitle(output);

  const note = await prisma.note.create({
    data: {
      title,
      sourceText: text,
      generated: output,
    },
  });

  return note.id;
}