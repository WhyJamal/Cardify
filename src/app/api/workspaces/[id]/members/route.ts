import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

/* ------------------ GET ------------------ */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: workspaceId } = await params;

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        id: true,
        ownerId: true,
        members: {
          select: {
            id: true,
            role: true,
            status: true,
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    const currentUserId = session.user.id;

    const isAllowed =
      workspace.ownerId === currentUserId ||
      workspace.members.some((m: { userId: string }) => m.userId === currentUserId);

    if (!isAllowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      members: workspace.members,
    });
  } catch (error) {
    console.error("Get members error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ------------------ POST ------------------ */

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: workspaceId } = await params;

    const body: { userIds?: string[] } = await req.json();

    const userIds: string[] = Array.isArray(body.userIds)
      ? [...new Set(body.userIds.filter(Boolean))]
      : [];

    if (!userIds.length) {
      return NextResponse.json({ error: "userIds is required" }, { status: 400 });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      select: {
        id: true,
        ownerId: true,
        members: {
          select: { userId: true },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const currentUserId = session.user.id as string;

    const isAllowed =
      workspace.ownerId === currentUserId ||
      workspace.members.some((m: { userId: string }) => m.userId === currentUserId);

    if (!isAllowed) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingMemberIds = new Set<string>(
      workspace.members.map((m: { userId: string }) => m.userId)
    );

    const newUserIds: string[] = userIds.filter((id: string) => !existingMemberIds.has(id));

    if (!newUserIds.length) {
      return NextResponse.json({ invited: 0, message: "No new members" });
    }

    await prisma.$transaction([
      prisma.workspaceMember.createMany({
        data: newUserIds.map((userId) => ({
          workspaceId,
          userId,
        })),
      }),
      ...newUserIds.map((userId) =>
        prisma.notification.create({
          data: {
            userId,
            type: "WORKSPACE_INVITE",
            title: `Вы добавлены в рабочее пространство "${workspace.name}"`,
            body: `${session.user.name ?? session.user.email} добавил(а) вас в рабочее пространство`,
            data: JSON.stringify({ workspaceId }),
          },
        })
      ),
    ]);

    return NextResponse.json({
      invited: newUserIds.length,
      message: "Users added to workspace",
    });
  } catch (error) {
    console.error("Invite members error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}