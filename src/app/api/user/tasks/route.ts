import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
        members: { some: { userId: dbUser.id } },
        //dueDate: { not: null },
        userTaskActions: {
          none: { status: { in: ["COMPLETED", "DISMISSED"] } },
        },
      },
      include: {
        column: {
          include: {
            board: {
              include: {
                workspace: true,
              },
            },
          },
        },
        labels: { include: { boardLabel: true } },
        members: true,
        comments: true,
      },
      orderBy: { dueDate: "asc" },
    });
    return NextResponse.json({ cards });
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
              include: {
                workspace: true,
              },
            },
          },
        },
        labels: { include: { boardLabel: true } },
        members: true,
        comments: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ cards });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}