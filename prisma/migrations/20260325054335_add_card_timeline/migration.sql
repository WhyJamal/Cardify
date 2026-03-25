-- CreateTable
CREATE TABLE "CardTimeline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'COMMENT',
    "authorName" TEXT NOT NULL,
    "initials" TEXT,
    "text" TEXT,
    "activityText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CardTimeline_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CardTimeline_cardId_createdAt_idx" ON "CardTimeline"("cardId", "createdAt");
