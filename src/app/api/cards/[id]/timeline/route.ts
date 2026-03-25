import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* ------------------ GET ------------------ */

export async function GET(
  _req: NextRequest,
  { params }: { params: { cardId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.cardTimeline.findMany({
    where: { cardId: params.cardId },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(items);
}

/* ------------------ POST ------------------ */

export async function POST(
  req: NextRequest,
  { params }: { params: { cardId: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const text = String(body.text ?? "").trim();

  if (!text) {
    return NextResponse.json({ error: "Comment is required" }, { status: 400 });
  }

  const authorName =
    session.user.name || session.user.email?.split("@")[0] || "Unknown";

  const initials = authorName
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const item = await prisma.cardTimeline.create({
    data: {
      cardId: params.cardId,
      type: "COMMENT",
      authorName,
      initials,
      text,
    },
  });

  return NextResponse.json(item, { status: 201 });
}