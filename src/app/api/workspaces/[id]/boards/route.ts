import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ workspaceId: string }> }
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

  const { workspaceId } = await params;

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      members: { some: { userId: dbUser.id } },
    },
  });

  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  const boards = await prisma.board.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      bg: true,
      isPhoto: true,
      columns: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          _count: { select: { cards: true } },
        },
      },
    },
  });

  return NextResponse.json({ boards });
}