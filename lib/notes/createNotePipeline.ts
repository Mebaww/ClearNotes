import "server-only";
import { createNote } from "@/lib/ai/createNotes";

export async function handleCreateNote(text: string, userId: string) {
  if (!text) {
    throw new Error("No text provided");
  }

  const noteId = await createNote(text, userId);

  return noteId;
}