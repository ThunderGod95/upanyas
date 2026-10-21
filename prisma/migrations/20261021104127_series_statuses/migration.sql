-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'CHINESE', 'KOREAN', 'JAPANESE', 'HINDI', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "SeriesVisibility" AS ENUM ('PUBLIC', 'UNLISTED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "SeriesSerializationStatus" AS ENUM ('UNKNOWN', 'NOT_APPLICABLE', 'NOT_STARTED', 'ONGOING', 'HIATUS', 'COMPLETED', 'DISCONTINUED');

-- AlterTable
ALTER TABLE "series" ADD COLUMN     "language" "Language" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "originalLanguage" "Language" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "originalStatus" "SeriesSerializationStatus" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "translationStatus" "SeriesSerializationStatus" NOT NULL DEFAULT 'UNKNOWN',
ADD COLUMN     "visibility" "SeriesVisibility" NOT NULL DEFAULT 'PRIVATE';

-- CreateIndex
CREATE INDEX "series_originalStatus_translationStatus_visibility_publishe_idx" ON "series"("originalStatus", "translationStatus", "visibility", "publishedAt" DESC);
