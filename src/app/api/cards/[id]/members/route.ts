import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BoardMember } from "@/generated/prisma/client";

export async function POST(
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
  const userId = String(body.userId ?? "").trim();

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: {
      column: {
        include: {
          board: {
            include: { members: true },
          },
        },
      },
    },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const board = card.column.board;
  const isBoardMember =
    board.ownerId === dbUser.id ||
    board.members.some((m: BoardMember) => m.userId === dbUser.id && m.status === "ACCEPTED");

  if (!isBoardMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // const targetIsBoardMember =
  //   board.ownerId === userId ||
  //   board.members.some((m: BoardMember) => m.userId === userId && m.status === "ACCEPTED");

  // if (!targetIsBoardMember) {
  //   return NextResponse.json(
  //     { error: "User is not a board member" },
  //     { status: 400 }
  //   );
  // }

  const existing = await prisma.cardMember.findUnique({
    where: { cardId_userId: { cardId, userId } },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Already a member" },
      { status: 400 }
    );
  }

  const cardMember = await prisma.$transaction([
    prisma.cardMember.create({
      data: { cardId, userId },
    }),
    prisma.notification.create({
      data: {
        userId,
        type: "CARD_ASSIGNED", 
        title: `Вы "${card.title ?? 'Card'}" вы присоединились к карте`,
        body: `${dbUser.name ?? dbUser.email} добавил(а) вас в карту`,
        data: JSON.stringify({ cardId, boardId: card.column.boardId }),
      },
    }),
  ]);

  return NextResponse.json({ ok: true, cardMember }, { status: 201 });
}