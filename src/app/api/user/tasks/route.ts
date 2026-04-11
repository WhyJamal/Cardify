import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const formatCard = (card: any) => ({
  ...card,
  labels: card.labels.map((l: { boardLabel: { id: string; color: string; name?: string } }) => ({
    id: l.boardLabel.id,
    color: l.boardLabel.color,
    name: l.boardLabel.name,
  })),
});

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

  const searchParams = req.nextUrl.searchParams;
  const type = searchParams.get("type");

  if (type === "attention") {
    const cards = await prisma.card.findMany({
      where: {
        OR: [
          {
            members: {
              some: { userId: dbUser.id },
            },
          },

          {
            AND: [
              { ownerId: dbUser.id },
              { dueDate: { not: null } },
            ],
          },
        ],
        userTaskActions: {
          none: { status: { in: ["COMPLETED", "DISMISSED"] } },
        },
      },
      include: {
        column: {
          include: {
            board: {
              include: { workspace: true },
            },
          },
        },
        labels: {
          include: {
            boardLabel: true,
          },
        },
        attachments: true,
        members: { include: { user: true } },
        comments: true,
        location: true,
      },
      orderBy: { dueDate: "asc" },
    });

    const formattedCards = cards.map(formatCard);

    return NextResponse.json({ cards: formattedCards });
  }

  if (type === "highlights") {
    const cards = await prisma.card.findMany({
      where: {
        userTaskActions: {
          some: { userId: dbUser.id, status: "COMPLETED" },
        },
      },
      include: {
        column: {
          include: {
            board: {
              include: { workspace: true },
            },
          },
        },
        labels: {
          include: {
            boardLabel: true,
          },
        },
        attachments: true,
        members: { include: { user: true } },
        comments: { include: { user: true } },
        location: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    const formattedCards = cards.map(formatCard);

    return NextResponse.json({ cards: formattedCards });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}