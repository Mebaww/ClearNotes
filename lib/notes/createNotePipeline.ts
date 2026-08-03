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

  // Check if user has enough credits (resets monthly credits if needed)
  await checkUsageLimit(userId, credits);

  // Reserve credits immediately to block concurrent bypass
  await incrementUsage(userId, credits);

  try {
    const noteId = await createNote(text, userId, style);
    return noteId;
  } catch (error) {
    // Refund the reserved credits if note generation fails
    await decrementUsage(userId, credits);
    throw error;
  }
}