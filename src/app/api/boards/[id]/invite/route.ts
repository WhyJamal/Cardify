import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBoardId } from "../route";

/* ------------------ POST ------------------ */

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

  const boardId = await getBoardId(params);
  const body = await req.json();
  const userId = String(body.userId ?? "").trim();

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const board = await prisma.board.findFirst({
    where: { id: boardId, ownerId: dbUser.id },
  });

  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const invitee = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!invitee) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // You cannot invite yourself
  // if (invitee.id === dbUser.id) {
  //   return NextResponse.json(
  //     { error: "You cannot invite yourself" },
  //     { status: 400 }
  //   );
  // }

  const existing = await prisma.boardMember.findUnique({
    where: { boardId_userId: { boardId, userId: invitee.id } },
  });

  if (existing) {
    return NextResponse.json(
      { error: "User already invited or a member" },
      { status: 200 }
    );
  }

  await prisma.$transaction([
    prisma.boardMember.create({
      data: {
        boardId,
        userId: invitee.id,
        status: "PENDING",
      },
    }),
    prisma.notification.create({
      data: {
        userId: invitee.id,
        type: "BOARD_INVITE",
        title: `Вы добавлены в доску "${board.title}"`,
        body: `${dbUser.name ?? dbUser.email} добавил(а) вас в доску`,
        data: JSON.stringify({
          boardId,
          boardTitle: board.title,
          boardBg: board.bg,
          boardIsPhoto: board.isPhoto,
          inviterId: dbUser.id,
          inviterName: dbUser.name ?? dbUser.email,
        }),
      },
    }),
  ]);

  return NextResponse.json({ ok: true }, { status: 201 });
}