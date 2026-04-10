import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

  const { columnId, title } = await req.json();

  if (!columnId || !title?.trim()) {
    return NextResponse.json(
      { error: "Invalid payload" },
      { status: 400 }
    );
  }

  // board: {
  //       ownerId: dbUser.id,
  //     },
  const column = await prisma.column.findFirst({
    where: {
      id: columnId
    },
    include: {
      cards: true,
    },
  });

  if (!column) {
    return NextResponse.json(
      { error: "Column not found" },
      { status: 404 }
    );
  }

  const position = column.cards.length;

  const card = await prisma.card.create({
    data: {
      title,
      columnId,
      position,
      ownerId: dbUser.id,
    },
    include: {
      labels: true,
      links: true,
    },
  });

  return NextResponse.json({ card });
}