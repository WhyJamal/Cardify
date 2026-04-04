-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Board" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "bg" TEXT NOT NULL,
    "isPhoto" BOOLEAN NOT NULL DEFAULT true,
    "isChoosen" BOOLEAN NOT NULL DEFAULT false,
    "workspaceId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Board_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Board_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Board" ("bg", "createdAt", "id", "isPhoto", "ownerId", "title", "updatedAt", "workspaceId") SELECT "bg", "createdAt", "id", "isPhoto", "ownerId", "title", "updatedAt", "workspaceId" FROM "Board";
DROP TABLE "Board";
ALTER TABLE "new_Board" RENAME TO "Board";
CREATE INDEX "Board_workspaceId_idx" ON "Board"("workspaceId");
CREATE INDEX "Board_ownerId_idx" ON "Board"("ownerId");
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
    "textColor" TEXT,
    "isArchive" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Card_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Card" ("assigneeColor", "assigneeInitials", "background", "checklistDone", "checklistTotal", "columnId", "createdAt", "description", "dueDate", "hasDescription", "id", "image", "isCompleted", "isImage", "numberBadge", "position", "size", "textColor", "title", "updatedAt", "watching") SELECT "assigneeColor", "assigneeInitials", "background", "checklistDone", "checklistTotal", "columnId", "createdAt", "description", "dueDate", "hasDescription", "id", "image", "isCompleted", "isImage", "numberBadge", "position", "size", "textColor", "title", "updatedAt", "watching" FROM "Card";
DROP TABLE "Card";
ALTER TABLE "new_Card" RENAME TO "Card";
CREATE INDEX "Card_columnId_position_idx" ON "Card"("columnId", "position");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
