/*
  Warnings:

  - You are about to drop the `MessagesLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RewindCron` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[document]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "document" TEXT;

-- DropTable
DROP TABLE "MessagesLog";

-- DropTable
DROP TABLE "RewindCron";

-- CreateTable
CREATE TABLE "trusttech_messages_log" (
    "id" UUID NOT NULL,
    "host_number" VARCHAR(25),
    "host_name" VARCHAR(25),
    "user_number" VARCHAR(25),
    "user_name" TEXT,
    "user_message" TEXT,
    "bot_response" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trusttech_messages_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trusttech_rewind_cron" (
    "id" UUID NOT NULL,
    "host_name" VARCHAR(25),
    "host_number" VARCHAR(25),
    "user_number" VARCHAR(25) NOT NULL,
    "user_name" VARCHAR(25),
    "active" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trusttech_rewind_cron_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_document_key" ON "User"("document");
