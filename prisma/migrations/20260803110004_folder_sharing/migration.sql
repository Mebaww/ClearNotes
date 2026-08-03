-- CreateTable
CREATE TABLE "FolderShare" (
    "id" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "passwordHash" TEXT,
    "expiresAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FolderShare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFolderAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shareId" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFolderAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FolderShare_folderId_key" ON "FolderShare"("folderId");

-- CreateIndex
CREATE UNIQUE INDEX "FolderShare_token_key" ON "FolderShare"("token");

-- CreateIndex
CREATE INDEX "FolderShare_token_idx" ON "FolderShare"("token");

-- CreateIndex
CREATE INDEX "FolderShare_folderId_idx" ON "FolderShare"("folderId");

-- CreateIndex
CREATE INDEX "UserFolderAccess_userId_idx" ON "UserFolderAccess"("userId");

-- CreateIndex
CREATE INDEX "UserFolderAccess_shareId_idx" ON "UserFolderAccess"("shareId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFolderAccess_userId_shareId_key" ON "UserFolderAccess"("userId", "shareId");

-- AddForeignKey
ALTER TABLE "FolderShare" ADD CONSTRAINT "FolderShare_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFolderAccess" ADD CONSTRAINT "UserFolderAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFolderAccess" ADD CONSTRAINT "UserFolderAccess_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "FolderShare"("id") ON DELETE CASCADE ON UPDATE CASCADE;
