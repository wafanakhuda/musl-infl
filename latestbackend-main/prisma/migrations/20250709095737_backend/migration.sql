/*
  Warnings:

  - The `campaign_type` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `deliverables` column on the `Campaign` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `creatorId` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Engagement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `budget_min` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `budget_max` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deadline` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `estimated_reach` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `userId` to the `CampaignApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PortfolioItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('open', 'closed', 'in_progress');

-- DropForeignKey
ALTER TABLE "Engagement" DROP CONSTRAINT "Engagement_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "PortfolioItem" DROP CONSTRAINT "PortfolioItem_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "status" "CampaignStatus" NOT NULL DEFAULT 'open',
DROP COLUMN "campaign_type",
ADD COLUMN     "campaign_type" TEXT[],
ALTER COLUMN "budget_min" SET NOT NULL,
ALTER COLUMN "budget_max" SET NOT NULL,
ALTER COLUMN "target_audience" DROP DEFAULT,
ALTER COLUMN "deadline" SET NOT NULL,
DROP COLUMN "deliverables",
ADD COLUMN     "deliverables" TEXT[],
ALTER COLUMN "estimated_reach" SET NOT NULL,
ALTER COLUMN "niche" DROP NOT NULL,
ALTER COLUMN "niche" DROP DEFAULT,
ALTER COLUMN "niche" SET DATA TYPE TEXT,
ALTER COLUMN "platforms" DROP NOT NULL,
ALTER COLUMN "platforms" DROP DEFAULT,
ALTER COLUMN "platforms" SET DATA TYPE TEXT,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "city" DROP DEFAULT,
ALTER COLUMN "city" SET DATA TYPE TEXT,
ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "country" DROP DEFAULT,
ALTER COLUMN "country" SET DATA TYPE TEXT,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "gender" DROP DEFAULT,
ALTER COLUMN "gender" SET DATA TYPE TEXT,
ALTER COLUMN "language" DROP NOT NULL,
ALTER COLUMN "language" DROP DEFAULT,
ALTER COLUMN "language" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "CampaignApplication" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "PortfolioItem" DROP COLUMN "creatorId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "reference" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gender",
DROP COLUMN "updated_at",
ADD COLUMN     "engagement" DOUBLE PRECISION,
ALTER COLUMN "platforms" DROP NOT NULL,
ALTER COLUMN "platforms" DROP DEFAULT,
ALTER COLUMN "platforms" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Engagement";

-- DropTable
DROP TABLE "Review";

-- CreateTable
CREATE TABLE "SearchLog" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CampaignApplication" ADD CONSTRAINT "CampaignApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SearchLog" ADD CONSTRAINT "SearchLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
