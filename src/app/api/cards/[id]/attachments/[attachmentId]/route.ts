import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ------------------ DELETE ------------------ */

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; attachmentId: string }> }
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

  const { id: cardId, attachmentId } = await params;

  const attachment = await prisma.cardAttachment.findUnique({
    where: { id: attachmentId },
  });

  if (!attachment || attachment.cardId !== cardId) {
    return NextResponse.json({ error: "Attachment not found" }, { status: 404 });
  }

  if (attachment.uploadedBy !== dbUser.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.cardAttachment.delete({
    where: { id: attachmentId },
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}