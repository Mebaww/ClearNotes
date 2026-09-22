import "server-only";
import { createNote } from "@/lib/ai/createNotes";
import { calculateCredits, checkUsageLimit, incrementUsage, decrementUsage } from "../usage";
import { AppError } from "../errors";
import { NoteStyle } from "@/types/note";

export async function handleCreateNote(
  text: string,
  userId: string,
  style: NoteStyle = "standard"
) {
  if (!text) {
    throw new AppError("INVALID_REQUEST", "No text provided");
  }

  const credits = calculateCredits(text);

  await checkUsageLimit(userId, credits);
  // Reserve credits upfront to prevent concurrent bypass
  await incrementUsage(userId, credits);

  try {
    const noteId = await createNote(text, userId, style);
    return noteId;
  } catch (error) {
    await decrementUsage(userId, credits);
    throw error;
  }
}