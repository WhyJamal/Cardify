import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; linkId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: cardId, linkId } = await params;

  const link = await prisma.cardLink.findUnique({ where: { id: linkId } });
  if (!link || link.cardId !== cardId)
    return NextResponse.json({ error: "Link not found" }, { status: 404 });

  await prisma.cardLink.delete({ where: { id: linkId } });

  return NextResponse.json({ ok: true });
}
