-- CreateTable
CREATE TABLE "featured_series" (
    "seriesId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "featured_series_pkey" PRIMARY KEY ("seriesId")
);

-- CreateIndex
CREATE INDEX "featured_series_position_idx" ON "featured_series"("position");

-- AddForeignKey
ALTER TABLE "featured_series" ADD CONSTRAINT "featured_series_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;
