import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: cardId } = await params;

  if (!cardId) {
    return NextResponse.json({ error: "Missing cardId" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: {
      column: {
        include: {
          board: true,
        },
      },
    },
  });

  if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });

  if (!card.column?.board) {
    return NextResponse.json({ error: "Board not found for this card" }, { status: 404 });
  }

  if (!card.column.board.title) {
    return NextResponse.json({ error: "Board slug missing" }, { status: 500 });
  }

  return NextResponse.json({
    boardId: card.column.board.id,
    boardSlug: card.column.board.title,
  });
}