/*
  Warnings:

  - You are about to drop the `CardBoardLabel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CardBoardLabel";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CardLabel" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardId" TEXT NOT NULL,
    "boardLabelId" TEXT NOT NULL,
    CONSTRAINT "CardLabel_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CardLabel_boardLabelId_fkey" FOREIGN KEY ("boardLabelId") REFERENCES "BoardLabel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "CardLabel_cardId_boardLabelId_idx" ON "CardLabel"("cardId", "boardLabelId");
