import "server-only";
import { prisma } from "@/lib/prisma";
import { AppError } from "../errors";

export async function createFolder(name: string, userId: string) {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new AppError("INVALID_REQUEST", "Folder name cannot be empty");
  }

  if (trimmedName.length > 50) {
    throw new AppError("INVALID_REQUEST", "Folder name must be under 50 characters");
  }

  // Check if a folder with the same name (case-insensitive) already exists for this user
  const existingFolder = await prisma.folder.findFirst({
    where: {
      userId,
      name: { equals: trimmedName, mode: "insensitive" },
    },
  });

  if (existingFolder) {
    return existingFolder;
  }

  return prisma.folder.create({
    data: {
      name: trimmedName,
      userId,
    },
  });
}
