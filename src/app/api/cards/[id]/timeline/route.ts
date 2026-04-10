import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ------------------ GET ------------------ */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: cardId } = await params;

  const items = await prisma.cardTimeline.findMany({
    where: { cardId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(items);
}

/* ------------------ POST (comment) ------------------ */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!dbUser)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id: cardId } = await params;
  const body = await req.json();
  const text = String(body.text ?? "").trim();

  if (!text)
    return NextResponse.json({ error: "text is required" }, { status: 400 });

  const item = await prisma.cardTimeline.create({
    data: {
      cardId,
      userId: dbUser.id,
      type: "COMMENT",
      authorName: dbUser.name || dbUser.email,
      initials: getInitials(dbUser.name || dbUser.email),
      text,
    },
    include: {
      user: true,
    },
  });

  return NextResponse.json(item, { status: 201 });
}