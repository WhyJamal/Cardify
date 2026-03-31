import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ------------------ POST ------------------ */

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{id: string}> }
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

  const body = await req.json();
  const action = String(body.action || "") as "accept" | "decline" | "dismiss";

  if (!["accept", "decline", "dismiss"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const { id: notificationId } = await params;
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId: dbUser.id },
  });

  if (!notification) {
    return NextResponse.json({ error: "Notification not found" }, { status: 404 });
  }

  if (action === "dismiss") {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isDismissed: true, isRead: true },
    });

    return NextResponse.json({ ok: true });
  }

  const data = JSON.parse(notification.data ?? "{}");

  const boardMember = await prisma.boardMember.findFirst({
    where: { boardId: data.boardId, userId: dbUser.id },
  });

  if (!boardMember) {
    return NextResponse.json(
      { error: "Invitation not found" },
      { status: 404 }
    );
  }

  const status = action === "accept" ? "ACCEPTED" : "DECLINED";

  await prisma.$transaction([
    prisma.boardMember.update({
      where: { id: boardMember.id },
      data: { status },
    }),
    prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    }),
  ]);

  return NextResponse.json({ ok: true });
}