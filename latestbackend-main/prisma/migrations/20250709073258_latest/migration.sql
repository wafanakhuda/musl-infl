/*
  Warnings:

  - You are about to drop the column `applications_count` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `moderation_status` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Campaign` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `Campaign` table. All the data in the column will be lost.
  - You are about to alter the column `budget_min` on the `Campaign` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `budget_max` on the `Campaign` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - The `city` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `country` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `gender` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `language` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdAt` on the `CampaignApplication` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `CampaignApplication` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Conversation` table. All the data in the column will be lost.
  - You are about to drop the column `conversation_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `read_at` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `sender_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `campaignId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `stripeIntentId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Transaction` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `moderation_status` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profile` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `price_max` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `price_min` on the `User` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the `OtpVerification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SearchAnalytics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SearchLog` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creatorId` to the `CampaignApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conversationId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `PortfolioItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `PortfolioItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `creatorId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CampaignApplication" DROP CONSTRAINT "CampaignApplication_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_sender_id_fkey";

-- DropForeignKey
ALTER TABLE "PortfolioItem" DROP CONSTRAINT "PortfolioItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "SearchLog" DROP CONSTRAINT "SearchLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_creatorId_fkey";

-- DropIndex
DROP INDEX "CampaignApplication_userId_campaignId_key";

-- DropIndex
DROP INDEX "ConversationParticipant_userId_conversationId_key";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "applications_count",
DROP COLUMN "moderation_status",
DROP COLUMN "status",
DROP COLUMN "tags",
ALTER COLUMN "campaign_type" SET NOT NULL,
ALTER COLUMN "campaign_type" SET DATA TYPE TEXT,
ALTER COLUMN "budget_min" DROP NOT NULL,
ALTER COLUMN "budget_min" SET DATA TYPE INTEGER,
ALTER COLUMN "budget_max" DROP NOT NULL,
ALTER COLUMN "budget_max" SET DATA TYPE INTEGER,
ALTER COLUMN "target_audience" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "deadline" DROP NOT NULL,
ALTER COLUMN "deliverables" SET NOT NULL,
ALTER COLUMN "deliverables" SET DATA TYPE TEXT,
DROP COLUMN "city",
ADD COLUMN     "city" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "country",
ADD COLUMN     "country" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "gender",
ADD COLUMN     "gender" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "language",
ADD COLUMN     "language" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "niche" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "platforms" SET DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "CampaignApplication" DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creatorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "conversation_id",
DROP COLUMN "read_at",
DROP COLUMN "sender_id",
ADD COLUMN     "conversationId" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PortfolioItem" DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "creatorId" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "campaignId",
DROP COLUMN "createdAt",
DROP COLUMN "currency",
DROP COLUMN "stripeIntentId",
DROP COLUMN "type",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "amount" SET DATA TYPE INTEGER,
ALTER COLUMN "status" SET DEFAULT 'pending',
ALTER COLUMN "creatorId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "moderation_status",
DROP COLUMN "otp",
DROP COLUMN "profile",
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "price_max" SET DATA TYPE INTEGER,
ALTER COLUMN "price_min" SET DATA TYPE INTEGER;

-- DropTable
DROP TABLE "OtpVerification";

-- DropTable
DROP TABLE "SearchAnalytics";

-- DropTable
DROP TABLE "SearchLog";

-- DropEnum
DROP TYPE "CampaignStatus";

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Engagement" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "reach" INTEGER,
    "avg_views" INTEGER,
    "ctr" DOUBLE PRECISION,

    CONSTRAINT "Engagement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Engagement_creatorId_key" ON "Engagement"("creatorId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "CampaignApplication" ADD CONSTRAINT "CampaignApplication_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
