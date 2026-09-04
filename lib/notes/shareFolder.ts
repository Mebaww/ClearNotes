import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export function generateShareToken(): string {
  return crypto.randomBytes(16).toString("hex");
}

export async function getFolderShareInfo(folderId: string, userId: string) {
  const folder = await prisma.folder.findFirst({
    where: { id: folderId, userId },
    include: { share: true },
  });

  if (!folder) return null;
  return folder.share;
}

export async function createOrUpdateFolderShareLink(folderId: string, userId: string) {
  const folder = await prisma.folder.findFirst({
    where: { id: folderId, userId },
    include: { share: true },
  });

  if (!folder) {
    throw new Error("Folder not found or unauthorized");
  }

  if (folder.share) {
    return await prisma.folderShare.update({
      where: { id: folder.share.id },
      data: { enabled: true },
    });
  }

  const token = generateShareToken();
  return await prisma.folderShare.create({
    data: {
      folderId,
      token,
      enabled: true,
    },
  });
}

export async function revokeFolderShareLink(folderId: string, userId: string) {
  const folder = await prisma.folder.findFirst({
    where: { id: folderId, userId },
    include: { share: true },
  });

  if (!folder || !folder.share) {
    throw new Error("Folder not found or not shared");
  }

  return await prisma.folderShare.update({
    where: { id: folder.share.id },
    data: { enabled: false },
  });
}

export async function regenerateFolderShareToken(folderId: string, userId: string) {
  const folder = await prisma.folder.findFirst({
    where: { id: folderId, userId },
    include: { share: true },
  });

  if (!folder) {
    throw new Error("Folder not found or unauthorized");
  }

  const newToken = generateShareToken();

  if (folder.share) {
    return await prisma.folderShare.update({
      where: { id: folder.share.id },
      data: {
        token: newToken,
        enabled: true,
      },
    });
  }

  return await prisma.folderShare.create({
    data: {
      folderId,
      token: newToken,
      enabled: true,
    },
  });
}

export async function recordUserFolderAccess(userId: string, shareId: string) {
  try {
    await prisma.userFolderAccess.upsert({
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
    console.error("Failed to record user folder access", err);
  }
}

export async function removeUserFolderAccess(userId: string, shareId: string) {
  try {
    await prisma.userFolderAccess.deleteMany({
      where: {
        userId,
        shareId,
      },
    });
  } catch (err) {
    console.error("Failed to remove user folder access", err);
  }
}



export async function getSharedFolderByToken(
  token: string,
  userId?: string,
  countView = true
) {
  const share = await prisma.folderShare.findUnique({
    where: { token },
    include: {
      folder: {
        include: {
          user: {
            select: { name: true, email: true },
          },
          notes: {
            orderBy: { createdAt: "desc" },
            include: { share: true },
          },
        },
      },
    },
  });

  if (!share || !share.enabled) {
    return null;
  }

  if (countView) {
    prisma.folderShare
      .update({
        where: { id: share.id },
        data: { viewCount: { increment: 1 } },
      })
      .catch((err: unknown) => console.error("Failed to increment folder view count", err));

    if (userId && share.folder.userId !== userId) {
      recordUserFolderAccess(userId, share.id);
    }
  }

  return {
    id: share.folder.id,
    name: share.folder.name,
    createdAt: share.folder.createdAt,
    updatedAt: share.folder.updatedAt,
    ownerId: share.folder.userId,
    ownerName: share.folder.user.name,
    token: share.token,
    viewCount: share.viewCount,
    notes: share.folder.notes,
  };
}

export async function getUserSharedFoldersCount(userId: string): Promise<number> {
  const ownedCount = await prisma.folderShare.count({
    where: {
      enabled: true,
      folder: {
        userId,
      },
    },
  });

  const accessedCount = await prisma.userFolderAccess.count({
    where: {
      userId,
      share: {
        enabled: true,
      },
    },
  });

  return ownedCount + accessedCount;
}

export async function getUserSharedFolders(userId: string) {
  const ownedShares = await prisma.folderShare.findMany({
    where: {
      enabled: true,
      folder: {
        userId,
      },
    },
    include: {
      folder: {
        include: {
          _count: {
            select: { notes: true },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const accessedEntries = await prisma.userFolderAccess.findMany({
    where: {
      userId,
      share: {
        enabled: true,
      },
    },
    include: {
      share: {
        include: {
          folder: {
            include: {
              user: {
                select: { name: true, email: true },
              },
              _count: {
                select: { notes: true },
              },
            },
          },
        },
      },
    },
    orderBy: {
      accessedAt: "desc",
    },
  });

  const sharedWithMe = accessedEntries
    .filter((entry) => entry.share?.folder && entry.share.folder.userId !== userId)
    .map((entry) => ({
      ...entry.share,
      isReceived: true,
    }));

  return {
    owned: ownedShares.map((s) => ({ ...s, isReceived: false })),
    sharedWithMe,
  };
}

