/*
  Warnings:

  - Made the column `userId` on table `ApprovalAction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ApprovalAction" ALTER COLUMN "userId" SET NOT NULL;
