-- CreateEnum
CREATE TYPE "WaitListStatus" AS ENUM ('PENDING', 'INVITED', 'JOINED');

-- CreateTable
CREATE TABLE "Waitlist" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT,
    "status" "WaitListStatus" NOT NULL DEFAULT 'PENDING',
    "joinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Waitlist_email_key" ON "Waitlist"("email");

-- CreateIndex
CREATE INDEX "Waitlist_email_idx" ON "Waitlist"("email");

-- CreateIndex
CREATE INDEX "Waitlist_status_idx" ON "Waitlist"("status");
