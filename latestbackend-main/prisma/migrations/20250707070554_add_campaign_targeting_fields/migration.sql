-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "age_range" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "estimated_reach" INTEGER,
ADD COLUMN     "followers_max" INTEGER,
ADD COLUMN     "followers_min" INTEGER,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "influencers_needed" INTEGER,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "niche" TEXT[],
ADD COLUMN     "platforms" TEXT[];
