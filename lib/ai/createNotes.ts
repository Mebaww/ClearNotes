import "server-only";
import { parsePDFDocument, ParsedDocument } from "../parse/formats/pdf";
import { prisma } from "../prisma";
import { geminiModel } from "./gemini";

function flattenDocument(doc: ParsedDocument): string {
  return doc.pages.map((p) => p.content).join("\n\n");
}
function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s(.+)/m);
  return match?.[1]?.trim() || "Untitled Note";
}

export async function createNote(buffer: ArrayBuffer) {
  const parsed = await parsePDFDocument(buffer);

  const text = flattenDocument(parsed);

  if (!text || text.trim().length < 20) {
    throw new Error("Empty document text could not be extracted.");
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