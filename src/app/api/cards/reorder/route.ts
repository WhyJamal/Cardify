import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

/* ------------------ PATCH ------------------ */

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await req.json();
  const { boardId, movedCardId, toColumnId, columns } = body;

  if (!boardId || !Array.isArray(columns)) {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    );
  }

  // ownerId: dbUser.id,
  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
    },
  });

  if (!board) {
    return NextResponse.json(
      { error: "Board not found" },
      { status: 404 }
    );
  }

  const columnIds = columns.map((item: { columnId: string }) => item.columnId);

  const dbColumns = await prisma.column.findMany({
    where: {
      id: { in: columnIds },
      boardId: board.id,
    },
    select: { id: true },
  });

  if (dbColumns.length !== columnIds.length) {
    return NextResponse.json(
      { error: "Some columns not found" },
      { status: 404 }
    );
  }

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (movedCardId && toColumnId) {
      await tx.card.update({
        where: { id: movedCardId },
        data: { columnId: toColumnId },
      });
    }

    for (const col of columns as Array<{ columnId: string; cardIds: string[] }>) {
      await Promise.all(
        col.cardIds.map((cardId, index) =>
          tx.card.update({
            where: { id: cardId },
            data: {
              position: index,
              columnId: col.columnId,
            },
          })
        )
      );
    }
  });

  return NextResponse.json({ success: true });
}