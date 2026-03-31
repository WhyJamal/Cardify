import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{id: string; userId: string}> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUserId = session.user.id;
    const { id: workspaceId, userId } = await params;

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: true },
    });

    if (!workspace)
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

    const isOwner = workspace.ownerId === dbUserId;
    const isSelf = dbUserId === userId;

    if (!isOwner && !isSelf)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.workspaceMember.delete({
      where: { workspaceId_userId: { workspaceId, userId } },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete workspace member error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}