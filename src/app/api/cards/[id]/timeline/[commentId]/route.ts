import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
