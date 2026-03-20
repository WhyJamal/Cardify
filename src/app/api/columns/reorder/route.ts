import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

  const { boardId, columnIds } = await req.json();

  if (!boardId || !Array.isArray(columnIds)) {
    return NextResponse.json(
      { error: "Invalid payload" },
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
      { error: "Board not found" },
      { status: 404 }
    );
  }

  await prisma.$transaction(
    columnIds.map((id: string, index: number) =>
      prisma.column.update({
        where: { id },
        data: { position: index },
      })
    )
  );

  return NextResponse.json({ success: true });
}