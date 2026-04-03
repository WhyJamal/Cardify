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
    // include: {
    //   labels: true,
    // },
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
  const workspaceId = String(body.workspaceId || "");

  if (!title) {
    return NextResponse.json(
      { error: "Title is required" },
      { status: 400 }
    );
  }

  const defaultLabels = [
    { color: "#10B981", name: "" },
    { color: "#FACC15", name: "" },
    { color: "#F97316", name: "" },
    { color: "#EF4444", name: "" },
    { color: "#A855F7", name: "" },
    { color: "#3B82F6", name: "" },
  ];

  const board = await prisma.board.create({
    data: {
      title,
      bg,
      isPhoto,
      owner: { connect: { id: dbUser.id } },
      workspace: { connect: { id: workspaceId } },
      labels: {
        create: defaultLabels.map((label, idx) => ({
          color: label.color,
          name: label.name,
          position: idx,
        })),
      },
      members: {    
      create: {
        userId: dbUser.id,
        status: "ACCEPTED", 
      },
    },
    },
  });

  return NextResponse.json({ board }, { status: 201 });
}