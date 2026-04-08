import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getInitials } from "@utils/getInitials";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!dbUser)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id: cardId } = await params;
  const body = await req.json();
  const url = String(body.url ?? "").trim();
  const text = String(body.text ?? "").trim();

  if (!url)
    return NextResponse.json({ error: "url is required" }, { status: 400 });

  const card = await prisma.card.findUnique({ where: { id: cardId } });
  if (!card)
    return NextResponse.json({ error: "Card not found" }, { status: 404 });

  const link = await prisma.cardLink.create({
    data: { cardId, url, text: text || url },
  });

  await prisma.cardTimeline.create({
    data: {
      cardId,
      type: "ACTIVITY",
      authorName: dbUser.name || dbUser.email,
      initials: getInitials(dbUser.name || dbUser.email),
      activityText: `добавил(а) ссылка: "${text || url}"`,
    },
  });

  return NextResponse.json(link, { status: 201 });
}