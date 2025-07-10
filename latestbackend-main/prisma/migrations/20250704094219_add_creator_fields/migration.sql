-- AlterTable
ALTER TABLE "User" ADD COLUMN     "followers" INTEGER,
ADD COLUMN     "platforms" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "price_max" DOUBLE PRECISION,
ADD COLUMN     "price_min" DOUBLE PRECISION;
