/*
  Warnings:

  - Added the required column `logId` to the `ApprovalAction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileApproveStatus" AS ENUM ('APPROVED', 'REJECTED', 'PENDING', 'FAILED');

-- AlterTable
ALTER TABLE "ApprovalAction" ADD COLUMN     "logId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UploadLog" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "filePath" TEXT,
    "uploadedBy" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" "FileApproveStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UploadLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ApprovalAction" ADD CONSTRAINT "ApprovalAction_logId_fkey" FOREIGN KEY ("logId") REFERENCES "UploadLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
