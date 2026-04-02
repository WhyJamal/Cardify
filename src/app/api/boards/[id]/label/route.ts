// src/app/api/boards/[id]/label/route.ts
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

  const board = await prisma.board.findFirst({
    where: { id: boardId, ownerId: dbUser.id },
  });

  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const body = await req.json();
  const name = body.name?.trim() ?? "";
  const color = body.color ?? null; 
  //const position = body.position ?? 0;

  try {
    const label = await prisma.boardLabel.create({
      data: {
        boardId: board.id,
        name: name !== "" ? name : null, 
        color,
        //position,
      },
    });

    return NextResponse.json({ ok: true, label }, { status: 201 });
  } catch (err) {
    console.error("Create label failed:", err);
    return NextResponse.json(
      { error: "Failed to create label" },
      { status: 500 }
    );
  }
}