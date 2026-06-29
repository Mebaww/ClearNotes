-- AlterEnum
ALTER TYPE "NoteStatus" ADD VALUE 'FAILED';

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "characters" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "monthlyCreditsUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "usageResetAt" TIMESTAMP(3);
