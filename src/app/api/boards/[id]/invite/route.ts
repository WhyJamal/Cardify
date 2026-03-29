import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ------------------ POST ------------------ */

export async function POST(
  req: NextRequest,
  { params }: { params: { boardId: string } }
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

  const boardId = parseInt(params.boardId);
  const body = await req.json();
  const email = String(body.email || "").trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const board = await prisma.board.findFirst({
    where: { id: boardId, ownerId: dbUser.id },
  });

  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const invitee = await prisma.user.findUnique({
    where: { email },
  });

  if (!invitee) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (invitee.id === dbUser.id) {
    return NextResponse.json(
      { error: "You cannot invite yourself" },
      { status: 400 }
    );
  }

  const existing = await prisma.boardMember.findUnique({
    where: { boardId_userId: { boardId, userId: invitee.id } },
  });

  if (existing) {
    return NextResponse.json(
      { error: "User already invited or a member" },
      { status: 400 }
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
        title: `"${board.title}" boardiga taklif`,
        body: `${dbUser.name ?? dbUser.email} sizni qo'shmoqchi`,
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