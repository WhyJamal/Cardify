/*
  Warnings:

  - You are about to drop the `Location` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Location";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CardLocation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "fullAddress" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Card" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "background" TEXT,
    "size" TEXT NOT NULL DEFAULT 'WIDE',
    "textColor" TEXT,
    "isArchive" BOOLEAN NOT NULL DEFAULT false,
    "columnId" TEXT NOT NULL,
    "locationId" TEXT,
    "ownerId" TEXT,
    CONSTRAINT "Card_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Card_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "CardLocation" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Card_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Card" ("assigneeColor", "assigneeInitials", "background", "checklistDone", "checklistTotal", "columnId", "createdAt", "description", "dueDate", "hasDescription", "id", "image", "isArchive", "isCompleted", "isImage", "locationId", "numberBadge", "ownerId", "position", "size", "textColor", "title", "updatedAt", "watching") SELECT "assigneeColor", "assigneeInitials", "background", "checklistDone", "checklistTotal", "columnId", "createdAt", "description", "dueDate", "hasDescription", "id", "image", "isArchive", "isCompleted", "isImage", "locationId", "numberBadge", "ownerId", "position", "size", "textColor", "title", "updatedAt", "watching" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
CREATE UNIQUE INDEX "Card_locationId_key" ON "Card"("locationId");
CREATE INDEX "Card_columnId_position_idx" ON "Card"("columnId", "position");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
