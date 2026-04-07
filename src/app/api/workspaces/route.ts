import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* ------------------ GET ------------------ */

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const workspaces = await prisma.workspace.findMany({
    where: {
      OR: [
        { ownerId: dbUser.id }, // owner
        {
          members: {
            some: {
              userId: dbUser.id, // member
            },
          },
        },
      ],
    },
    include: {
      _count: {
        select: {
          boards: true,
          members: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json({ workspaces });
}

/* ------------------ POST ------------------ */

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!dbUser) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const { name, description, type } = await req.json();

  if (!name?.trim()) {
    return NextResponse.json(
      { error: "Workspace name required" },
      { status: 400 }
    );
  }

  if (description && description.length > 500) {
    return NextResponse.json(
      { error: "Description too long" },
      { status: 400 }
    );
  }

  const workspace = await prisma.workspace.create({
    data: {
      name,
      description,
      typeKey: type,
      ownerId: dbUser.id,

      members: {
        create: {
          userId: dbUser.id,
          role: "OWNER",
        },
      },
    },
    include: {
      members: true,
      boards: true,
    },
  });

  return NextResponse.json({ workspace });
}