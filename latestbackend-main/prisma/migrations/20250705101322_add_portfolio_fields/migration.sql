/*
  Warnings:

  - You are about to drop the column `campaignId` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `creatorId` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `PortfolioItem` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `PortfolioItem` table. All the data in the column will be lost.
  - Added the required column `mediaUrl` to the `PortfolioItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `PortfolioItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `PortfolioItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PortfolioItem" DROP CONSTRAINT "PortfolioItem_campaignId_fkey";

-- DropForeignKey
ALTER TABLE "PortfolioItem" DROP CONSTRAINT "PortfolioItem_creatorId_fkey";

-- AlterTable
ALTER TABLE "PortfolioItem" DROP COLUMN "campaignId",
DROP COLUMN "creatorId",
DROP COLUMN "name",
DROP COLUMN "url",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "mediaUrl" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
