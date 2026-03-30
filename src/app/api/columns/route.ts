import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BoardLabel, Card, CardBoardLabel, Column } from "@/generated/prisma/client";

/* ------------------ GET ------------------ */

export async function GET(req: NextRequest) {
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

  const boardId = req.nextUrl.searchParams.get("boardId");
  if (!boardId) {
    return NextResponse.json({ error: "Board ID is required" }, { status: 400 });
  }

  const board = await prisma.board.findFirst({
    where: { id: parseInt(boardId), ownerId: dbUser.id },
    include: {
      columns: {
        orderBy: {
          position: "asc",
        },
        include: {
          cards: {
            orderBy: {
              position: "asc",
            },
            include: {
              labels: { include: { boardLabel: true } },
              links: true,
              members: { include: { user: true }}
            },
          },
        },
      },
    },
  });

  if (!board) {
    return NextResponse.json({ error: "Board not found or unauthorized" }, { status: 404 });
  }

  type FlattenedCard = Card & {
    labels: { id: string; name?: string; color: string; checked: boolean }[];
    links: any[];
  };

  type FlattenedColumn = Column & {
    cards: FlattenedCard[];
  };

  const columns: FlattenedColumn[] = board.columns.map(
    (col: Column & { cards: (Card & { labels: (CardBoardLabel & { boardLabel: BoardLabel })[]; links: any[] })[] }) => ({
      ...col,
      cards: col.cards.map(
        (card: Card & { labels: (CardBoardLabel & { boardLabel: BoardLabel })[]; links: any[] }) => ({
          ...card,
          labels: card.labels.map(
            (item: CardBoardLabel & { boardLabel: BoardLabel }) => ({
              id: item.boardLabel.id,
              name: item.boardLabel.name,
              color: item.boardLabel.color,
              checked: true,
            })
          ),
        })
      ),
    })
  );

  return NextResponse.json({ columns });
}
/* ------------------ POST ------------------ */

export async function POST(req: NextRequest) {
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
  const boardId = Number(body.boardId);
  const title = String(body.title ?? "").trim();

  if (!boardId || !title) {
    return NextResponse.json(
      { error: "Board ID and title are required" },
      { status: 400 }
    );
  }

  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      ownerId: dbUser.id,
    },
  });

  if (!board) {
    return NextResponse.json(
      { error: "Board not found or unauthorized" },
      { status: 404 }
    );
  }

  const lastColumn = await prisma.column.findFirst({
    where: { boardId },
    orderBy: { position: 'desc' },
  });

  const newPosition = lastColumn ? lastColumn.position + 1 : 1;

  const column = await prisma.column.create({
    data: {
      title,
      boardId,
      position: newPosition,
    },
    include: {
      cards: {
        include: {
          labels: true,
          links: true,
        },
      },
    },
  });

  return NextResponse.json({ column }, { status: 201 });
}