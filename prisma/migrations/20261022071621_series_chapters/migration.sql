-- CreateTable
CREATE TABLE "volume" (
    "id" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "volume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapter" (
    "id" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "volumeId" TEXT,
    "position" INTEGER NOT NULL,
    "numberLabel" TEXT,
    "firstPublishedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapter_draft" (
    "chapterId" TEXT NOT NULL,
    "baseRevisionId" TEXT,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "authorNote" TEXT,
    "translatorNote" TEXT,
    "version" INTEGER NOT NULL DEFAULT 1,
    "lastEditedById" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapter_draft_pkey" PRIMARY KEY ("chapterId")
);

-- CreateTable
CREATE TABLE "chapter_revision" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "revisionNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "authorNote" TEXT,
    "translatorNote" TEXT,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "characterCount" INTEGER NOT NULL DEFAULT 0,
    "changeSummary" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chapter_revision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapter_publication" (
    "chapterId" TEXT NOT NULL,
    "revisionId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapter_publication_pkey" PRIMARY KEY ("chapterId")
);

-- CreateIndex
CREATE UNIQUE INDEX "volume_seriesId_position_key" ON "volume"("seriesId", "position");

-- CreateIndex
CREATE INDEX "chapter_volumeId_position_idx" ON "chapter"("volumeId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "chapter_seriesId_position_key" ON "chapter"("seriesId", "position");

-- CreateIndex
CREATE INDEX "chapter_revision_chapterId_createdAt_idx" ON "chapter_revision"("chapterId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "chapter_revision_chapterId_revisionNumber_key" ON "chapter_revision"("chapterId", "revisionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "chapter_publication_revisionId_key" ON "chapter_publication"("revisionId");

-- AddForeignKey
ALTER TABLE "volume" ADD CONSTRAINT "volume_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter" ADD CONSTRAINT "chapter_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "series"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter" ADD CONSTRAINT "chapter_volumeId_fkey" FOREIGN KEY ("volumeId") REFERENCES "volume"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_draft" ADD CONSTRAINT "chapter_draft_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_draft" ADD CONSTRAINT "chapter_draft_baseRevisionId_fkey" FOREIGN KEY ("baseRevisionId") REFERENCES "chapter_revision"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_draft" ADD CONSTRAINT "chapter_draft_lastEditedById_fkey" FOREIGN KEY ("lastEditedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_revision" ADD CONSTRAINT "chapter_revision_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_revision" ADD CONSTRAINT "chapter_revision_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_publication" ADD CONSTRAINT "chapter_publication_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_publication" ADD CONSTRAINT "chapter_publication_revisionId_fkey" FOREIGN KEY ("revisionId") REFERENCES "chapter_revision"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
