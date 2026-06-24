import "server-only";
import { ValidateFile } from "@/lib/parse/formats/pdf";
import { createNote } from "@/lib/ai/createNotes";

const PAGE_LIMIT = 20;

export async function handleCreateNote(file: File) {
  if (!file) {
    throw new Error("No file provided");
  }

  const arrayBuffer = await file.arrayBuffer();

  const precheck = ValidateFile(arrayBuffer, PAGE_LIMIT);
  
  if (!precheck.valid) {
    const errorInfo = precheck.error!;
    throw Object.assign(new Error(errorInfo.message), { code: errorInfo.code });
  }

  const noteId = await createNote(arrayBuffer);

  return noteId;
}