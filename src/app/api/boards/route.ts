import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ------------------ GET ------------------ */

export async function GET() {
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

  const boards = await prisma.board.findMany({
    where: { ownerId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ boards });
}

/* ------------------ POST ------------------ */

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) {
    return Response.json({ error: "User not found" }, { status: 404 });
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

  const board = await prisma.board.create({
    data: {
      title,
      bg,
      isPhoto,
      ownerId: dbUser.id,
    },
  });

  return NextResponse.json({ board }, { status: 201 });
}