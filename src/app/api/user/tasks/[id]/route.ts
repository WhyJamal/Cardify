import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!dbUser) {
    console.log("asdasd")
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status } = body; // "COMPLETED" | "DISMISSED" | "PENDING"

  if (!["COMPLETED", "DISMISSED", "PENDING"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const userTaskAction = await prisma.userTaskAction.upsert({
    where: {
      userId_cardId: { userId: dbUser.id, cardId: id },
    },
    update: { status },
    create: {
      userId: dbUser.id,
      cardId: id,
      status,
    },
  });

  return NextResponse.json({ userTaskAction });
}