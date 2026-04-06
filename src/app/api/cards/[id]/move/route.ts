import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { getBoardId } from "@/app/api/boards/[id]/route";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

  const { id: cardId } = await params;
  const body = await req.json();
  const {targetColumnId, targetPosition } = body;

  const targetBoardId = getBoardId(body.targetBoardId);

  if (!targetBoardId || !targetColumnId || targetPosition === undefined) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const card = await prisma.card.findFirst({
    where: { id: cardId },
    include: {
      column: {
        include: {
          board: {
            include: {
              members: { where: { userId: dbUser.id } },
            },
          },
        },
      },
    },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  if (card.column.board.members.length === 0) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const targetColumn = await prisma.column.findFirst({
    where: {
      id: targetColumnId,
      board: {
        id: targetBoardId,
        members: { some: { userId: dbUser.id } },
      },
    },
    include: {
      cards: {
        orderBy: { position: "asc" },
        select: { id: true },
      },
    },
  });

  if (!targetColumn) {
    return NextResponse.json({ error: "Target column not found" }, { status: 404 });
  }

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.card.update({
      where: { id: cardId },
      data: {
        columnId: targetColumnId,
        position: targetPosition,
      },
    });

    const otherCards = targetColumn.cards.filter((c: { id: string }) => c.id !== cardId);

    const updates = otherCards.map((c: { id: string }, idx: number) => {
      const newPosition = idx >= targetPosition ? idx + 1 : idx;
      return tx.card.update({
        where: { id: c.id },
        data: { position: newPosition },
      });
    });

    await Promise.all(updates);
  });

  return NextResponse.json({ success: true });
}