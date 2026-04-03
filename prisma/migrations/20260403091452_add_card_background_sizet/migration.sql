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
    "background" TEXT,
    "size" TEXT NOT NULL DEFAULT 'WIDE',
    CONSTRAINT "Card_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Card" ("assigneeColor", "assigneeInitials", "background", "checklistDone", "checklistTotal", "columnId", "createdAt", "description", "dueDate", "hasDescription", "id", "image", "isCompleted", "isImage", "numberBadge", "position", "title", "updatedAt", "watching") SELECT "assigneeColor", "assigneeInitials", "background", "checklistDone", "checklistTotal", "columnId", "createdAt", "description", "dueDate", "hasDescription", "id", "image", "isCompleted", "isImage", "numberBadge", "position", "title", "updatedAt", "watching" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
CREATE INDEX "Card_columnId_position_idx" ON "Card"("columnId", "position");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
