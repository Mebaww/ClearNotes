/*
  Warnings:

  - The `status` column on the `Note` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "NoteStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED');

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "status",
ADD COLUMN     "status" "NoteStatus" NOT NULL DEFAULT 'PROCESSING';

-- DropEnum
DROP TYPE "NotesStatus";
