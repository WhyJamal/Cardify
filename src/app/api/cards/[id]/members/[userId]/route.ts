import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{id: string; userId: string}>}
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

  const { id: cardId, userId } = await params;

  const card = await prisma.card.findUnique({
    where: { id: cardId },
    include: {
      column: {
        include: {
          board: { select: { ownerId: true } },
        },
      },
    },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const isOwner = card.column.board.ownerId === dbUser.id;
  const isSelf = dbUser.id === userId;

  if (!isOwner && !isSelf) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.cardMember.delete({
    where: { cardId_userId: { cardId, userId } },
  });

  return NextResponse.json({ ok: true });
}