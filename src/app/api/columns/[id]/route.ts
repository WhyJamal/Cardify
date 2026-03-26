import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: columnId } = await params;

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

  const body = await req.json();
  const title = String(body.title ?? "").trim();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    const column = await prisma.column.findFirst({
      where: {
        id: columnId,
        board: { ownerId: dbUser.id },
      },
    });

    if (!column) {
      return NextResponse.json(
        { error: "Column not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedColumn = await prisma.column.update({
      where: { id: columnId },
      data: { title },
    });

    return NextResponse.json({ column: updatedColumn });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update column" },
      { status: 500 }
    );
  }
}