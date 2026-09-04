import { prisma } from "@/lib/prisma";
import { AppError } from "../errors";
import crypto from "crypto";

export function generateShareToken(): string {
  return crypto.randomBytes(16).toString("hex");
}

export async function getNoteShareInfo(noteId: string, userId: string) {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId },
    include: { share: true },
  });

  if (!note) return null;
  return note.share;
}

export async function createOrUpdateShareLink(noteId: string, userId: string) {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId },
    include: { share: true },
  });

  if (!note) {
    throw new AppError("NOT_FOUND", "Note not found or unauthorized");
  }

  if (note.share) {
    // If share record exists, enable it
    return await prisma.noteShare.update({
      where: { id: note.share.id },
      data: { enabled: true },
    });
  }

  // Create new share link with unguessable token
  const token = generateShareToken();
  return await prisma.noteShare.create({
    data: {
      noteId,
      token,
      enabled: true,
    },
  });
}

export async function revokeShareLink(noteId: string, userId: string) {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId },
    include: { share: true },
  });

  if (!note || !note.share) {
    throw new AppError("NOT_FOUND", "Note not found or not shared");
  }

  return await prisma.noteShare.update({
    where: { id: note.share.id },
    data: { enabled: false },
  });
}

export async function regenerateShareToken(noteId: string, userId: string) {
  const note = await prisma.note.findFirst({
    where: { id: noteId, userId },
    include: { share: true },
  });

  if (!note) {
    throw new AppError("NOT_FOUND", "Note not found or unauthorized");
  }

  const newToken = generateShareToken();

  if (note.share) {
    return await prisma.noteShare.update({
      where: { id: note.share.id },
      data: {
        token: newToken,
        enabled: true,
      },
    });
  }

  return await prisma.noteShare.create({
    data: {
      noteId,
      token: newToken,
      enabled: true,
    },
  });
}

export async function recordUserNoteAccess(userId: string, shareId: string) {
  try {
    await prisma.userNoteAccess.upsert({
      where: {
        userId_shareId: {
          userId,
          shareId,
        },
      },
      update: {
        accessedAt: new Date(),
      },
      create: {
        userId,
        shareId,
      },
    });
  } catch (err) {
    console.error("Failed to record user note access", err);
  }
}

export async function removeUserNoteAccess(userId: string, shareId: string) {
  try {
    await prisma.userNoteAccess.deleteMany({
      where: {
        userId,
        shareId,
      },
    });
  } catch (err) {
    console.error("Failed to remove user note access", err);
  }
}




export async function getSharedNoteByToken(
  token: string,
  userId?: string,
  countView = true
) {
  const share = await prisma.noteShare.findUnique({
    where: { token },
    include: {
      note: true,
    },
  });

  if (!share || !share.enabled) {
    return null;
  }

  if (countView) {
    // Increment view count asynchronously — only on the actual page render, not metadata
    prisma.noteShare
      .update({
        where: { id: share.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((err) => console.error("Failed to increment view count", err));

    // If user is logged in and not the owner, persist their access
    if (userId && share.note.userId !== userId) {
      recordUserNoteAccess(userId, share.id);
    }
  }

  return {
    id: share.note.id,
    title: share.note.title,
    generated: share.note.generated,
    createdAt: share.note.createdAt,
    updatedAt: share.note.updatedAt,
    ownerId: share.note.userId,
  };
}

export async function getUserSharedNotesCount(userId: string): Promise<number> {
  const ownedCount = await prisma.noteShare.count({
    where: {
      enabled: true,
      note: {
        userId,
      },
    },
  });

  const accessedCount = await prisma.userNoteAccess.count({
    where: {
      userId,
      share: {
        enabled: true,
      },
    },
  });

  return ownedCount + accessedCount;
}

export async function getUserSharedNotes(userId: string) {
  // Owned shared notes
  const ownedShares = await prisma.noteShare.findMany({
    where: {
      enabled: true,
      note: {
        userId,
      },
    },
    include: {
      note: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Shared with me (accessed by user & still enabled)
  const accessedEntries = await prisma.userNoteAccess.findMany({
    where: {
      userId,
      share: {
        enabled: true,
      },
    },
    include: {
      share: {
        include: {
          note: true,
        },
      },
    },
    orderBy: {
      accessedAt: "desc",
    },
  });

  const sharedWithMe = accessedEntries
    .filter((entry) => entry.share?.note && entry.share.note.userId !== userId)
    .map((entry) => ({
      ...entry.share,
      isReceived: true,
    }));

  return {
    owned: ownedShares.map((s) => ({ ...s, isReceived: false })),
    sharedWithMe,
  };
}

