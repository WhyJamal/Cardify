/*
  Warnings:

  - You are about to drop the `CardLabel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CardLabel";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "BoardLabel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boardId" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "name" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "BoardLabel_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CardBoardLabel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardId" TEXT NOT NULL,
    "boardLabelId" TEXT NOT NULL,
    CONSTRAINT "CardBoardLabel_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CardBoardLabel_boardLabelId_fkey" FOREIGN KEY ("boardLabelId") REFERENCES "BoardLabel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "BoardLabel_boardId_idx" ON "BoardLabel"("boardId");

-- CreateIndex
CREATE INDEX "CardBoardLabel_cardId_boardLabelId_idx" ON "CardBoardLabel"("cardId", "boardLabelId");
