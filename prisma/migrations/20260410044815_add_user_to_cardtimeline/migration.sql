-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CardTimeline" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardId" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL DEFAULT 'COMMENT',
    "authorName" TEXT NOT NULL,
    "initials" TEXT,
    "text" TEXT,
    "activityText" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CardTimeline_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CardTimeline_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_CardTimeline" ("activityText", "authorName", "cardId", "createdAt", "id", "initials", "text", "type", "updatedAt") SELECT "activityText", "authorName", "cardId", "createdAt", "id", "initials", "text", "type", "updatedAt" FROM "CardTimeline";
DROP TABLE "CardTimeline";
ALTER TABLE "new_CardTimeline" RENAME TO "CardTimeline";
CREATE INDEX "CardTimeline_cardId_createdAt_idx" ON "CardTimeline"("cardId", "createdAt");
CREATE INDEX "CardTimeline_userId_idx" ON "CardTimeline"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
