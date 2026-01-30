-- CreateEnum
CREATE TYPE "PendingStatus" AS ENUM ('QUEUED', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "PendingAccomplishment" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "category" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "rawInput" TEXT NOT NULL,
    "source" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "PendingStatus" NOT NULL DEFAULT 'QUEUED',
    "reasoning" TEXT,
    "errorMessage" TEXT,
    "reviewerNotes" TEXT,
    "processedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PendingAccomplishment_pkey" PRIMARY KEY ("id")
);
