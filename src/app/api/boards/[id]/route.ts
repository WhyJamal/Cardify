import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ------------------ utils ------------------ */

function parseBoardId(id: string): number | null {
  const boardId = Number(id);
  return Number.isFinite(boardId) ? boardId : null;
}

export async function getBoardId(
  params: Promise<{ id: string }>
): Promise<number | null> {
  const { id } = await params;
  return parseBoardId(id);
}

async function getOwnedBoard(boardId: number) {
  return prisma.board.findUnique({
    where: { id: boardId },
    include: {
      members: {
        include: {
          user: true, 
        },
      },
    }
  });
}

async function requireUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  return session.user.id;
}

/* ------------------ GET ------------------ */

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUser();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const boardId = await getBoardId(params);

  if (!boardId) {
    return NextResponse.json({ error: "Invalid board id" }, { status: 400 });
  }

  const board = await getOwnedBoard(boardId);

  if (!board) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  return NextResponse.json({ board });
}

/* ------------------ PATCH ------------------ */

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUser();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const boardId = await getBoardId(params);

  if (!boardId) {
    return NextResponse.json({ error: "Invalid board id" }, { status: 400 });
  }

  const existing = await getOwnedBoard(boardId);
  if (!existing) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const body = await req.json();

  const data: {
    title?: string;
    bg?: string;
    isPhoto?: boolean;
  } = {};

  if (body.title !== undefined)
    data.title = String(body.title).trim();

  if (body.bg !== undefined)
    data.bg = String(body.bg);

  if (body.isPhoto !== undefined)
    data.isPhoto = Boolean(body.isPhoto);

  if (data.title !== undefined && !data.title) {
    return NextResponse.json(
      { error: "Title cannot be empty" },
      { status: 400 }
    );
  }

  const board = await prisma.board.update({
    where: { id: boardId },
    data,
  });

  return NextResponse.json({ board });
}

/* ------------------ PUT ------------------ */

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUser();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const boardId = await getBoardId(params);

  if (!boardId) {
    return NextResponse.json({ error: "Invalid board id" }, { status: 400 });
  }

  const existing = await getOwnedBoard(boardId);
  if (!existing) {
    return NextResponse.json({ error: "Board not found" }, { status: 404 });
  }

  const body = await req.json();

  const title = String(body.title || "").trim();
  const bg = String(body.bg || "");
  const isPhoto = Boolean(body.isPhoto);

  if (!title) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  const board = await prisma.board.update({
    where: { id: boardId },
    data: {
      title,
      bg,
      isPhoto,
    },
  });

  return NextResponse.json({ board });
}