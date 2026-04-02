import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ------------------ DELETE ------------------ */

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: cardId, commentId } = await params;

  const comment = await prisma.cardTimeline.findUnique({ where: { id: commentId } });
  if (!comment || comment.cardId !== cardId)
    return NextResponse.json({ error: "Link not found" }, { status: 404 });

  await prisma.cardTimeline.delete({ where: { id: commentId } });

  return NextResponse.json({ ok: true });
}

/* ------------------ PATCH ------------------ */

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const { commentId } = await params;

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
  const comment = String(body.comment ?? "").trim();

  if (!comment) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    const timeline = await prisma.cardTimeline.findFirst({
      where: {
        id: commentId
      },
    });

    if (!timeline) {
      return NextResponse.json(
        { error: "Timeline not found or unauthorized" },
        { status: 404 }
      );
    }

    const updatedComment = await prisma.cardTimeline.update({
      where: { id: commentId },
      data: { text: comment },
    });

    return NextResponse.json({ comment: updatedComment });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update column" },
      { status: 500 }
    );
  }
}