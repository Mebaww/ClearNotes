-- CreateTable
CREATE TABLE "UserNoteAccess" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "shareId" TEXT NOT NULL,
    "accessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserNoteAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserNoteAccess_userId_idx" ON "UserNoteAccess"("userId");

-- CreateIndex
CREATE INDEX "UserNoteAccess_shareId_idx" ON "UserNoteAccess"("shareId");

-- CreateIndex
CREATE UNIQUE INDEX "UserNoteAccess_userId_shareId_key" ON "UserNoteAccess"("userId", "shareId");

-- AddForeignKey
ALTER TABLE "UserNoteAccess" ADD CONSTRAINT "UserNoteAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserNoteAccess" ADD CONSTRAINT "UserNoteAccess_shareId_fkey" FOREIGN KEY ("shareId") REFERENCES "NoteShare"("id") ON DELETE CASCADE ON UPDATE CASCADE;
