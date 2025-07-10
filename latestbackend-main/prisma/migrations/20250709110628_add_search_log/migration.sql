/*
  Warnings:

  - You are about to drop the column `status` on the `Campaign` table. All the data in the column will be lost.
  - The `niche` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `platforms` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `city` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `country` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `gender` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `language` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `read` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `SearchLog` table. All the data in the column will be lost.
  - You are about to drop the column `term` on the `SearchLog` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `engagement` on the `User` table. All the data in the column will be lost.
  - The `platforms` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updated_at` to the `Conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `PortfolioItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `PortfolioItem` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `query` to the `SearchLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PortfolioItem" DROP CONSTRAINT "PortfolioItem_userId_fkey";

-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "status",
ALTER COLUMN "budget_min" DROP NOT NULL,
ALTER COLUMN "budget_max" DROP NOT NULL,
ALTER COLUMN "target_audience" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "deadline" DROP NOT NULL,
ALTER COLUMN "estimated_reach" DROP NOT NULL,
DROP COLUMN "niche",
ADD COLUMN     "niche" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "platforms",
ADD COLUMN     "platforms" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "city",
ADD COLUMN     "city" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "country",
ADD COLUMN     "country" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "gender",
ADD COLUMN     "gender" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "language",
ADD COLUMN     "language" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "campaign_type" SET NOT NULL,
ALTER COLUMN "campaign_type" SET DATA TYPE TEXT,
ALTER COLUMN "deliverables" SET NOT NULL,
ALTER COLUMN "deliverables" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "read";

-- AlterTable
ALTER TABLE "PortfolioItem" DROP COLUMN "userId",
ADD COLUMN     "creatorId" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "SearchLog" DROP COLUMN "created_at",
DROP COLUMN "term",
ADD COLUMN     "query" TEXT NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "reference",
DROP COLUMN "type",
ALTER COLUMN "status" SET DEFAULT 'pending';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "engagement",
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "platforms",
ADD COLUMN     "platforms" TEXT[] DEFAULT ARRAY[]::TEXT[];

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

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Engagement" ADD CONSTRAINT "Engagement_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
