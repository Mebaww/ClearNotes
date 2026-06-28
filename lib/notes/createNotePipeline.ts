import "server-only";
import { createNote } from "@/lib/ai/createNotes";
import { calculateCredits, checkUsageLimit, incrementUsage } from "../usage";
import { AppError } from "../errors";

export async function handleCreateNote(text: string, userId: string) {
  if (!text) {
    throw new AppError("INVALID_REQUEST", "No text provided");
  }

  const credits = calculateCredits(text)

  await checkUsageLimit(userId, credits)

  const noteId = await createNote(text, userId);

  await incrementUsage(userId, credits)
  
  return noteId;
}