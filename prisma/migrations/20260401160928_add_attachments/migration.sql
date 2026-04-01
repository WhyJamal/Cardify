/*
  Warnings:

  - You are about to drop the column `attachments` on the `Card` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "CardAttachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cardId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "uploadedBy" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CardAttachment_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "columnId" TEXT NOT NULL,
    "title" TEXT,
    "image" TEXT,
    "numberBadge" INTEGER,
    "description" TEXT,
    "hasDescription" BOOLEAN NOT NULL DEFAULT false,
    "watching" BOOLEAN NOT NULL DEFAULT false,
    "checklistDone" INTEGER NOT NULL DEFAULT 0,
    "checklistTotal" INTEGER NOT NULL DEFAULT 0,
    "assigneeInitials" TEXT,
    "assigneeColor" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "dueDate" DATETIME,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isImage" BOOLEAN NOT NULL DEFAULT false,
    "thumbnailUrl" TEXT,
    CONSTRAINT "Card_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Card" ("assigneeColor", "assigneeInitials", "checklistDone", "checklistTotal", "columnId", "createdAt", "description", "dueDate", "hasDescription", "id", "image", "isCompleted", "numberBadge", "position", "title", "updatedAt", "watching") SELECT "assigneeColor", "assigneeInitials", "checklistDone", "checklistTotal", "columnId", "createdAt", "description", "dueDate", "hasDescription", "id", "image", "isCompleted", "numberBadge", "position", "title", "updatedAt", "watching" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
CREATE INDEX "Card_columnId_position_idx" ON "Card"("columnId", "position");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "CardAttachment_cardId_idx" ON "CardAttachment"("cardId");
