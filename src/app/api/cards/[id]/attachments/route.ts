import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getInitials } from "@utils/getInitials";

async function getCardId(params: Promise<{ id: string }>) {
  return (await params).id;
}

/* ------------------ POST ------------------ */

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
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const cardId = await getCardId(params);

  const card = await prisma.card.findUnique({
    where: { id: cardId },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  const contentType = req.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    const uploadedUrl = "http://localhost:3000/" + file.name;

    const attachment = await prisma.cardAttachment.create({
      data: {
        cardId,
        fileName: file.name,
        fileUrl: uploadedUrl,
        fileSize: file.size,
        mimeType: file.type,
        uploadedBy: dbUser.id,
      },
    });

    await prisma.cardTimeline.create({
      data: {
        cardId,
        type: "ACTIVITY",
        authorName: dbUser.name || dbUser.email,
        initials: getInitials(dbUser.name || dbUser.email),
        activityText: `добавил(а) файл: "${file.name}"`,
      },
    });

    return NextResponse.json(attachment, { status: 201 });
  }

  const body = await req.json();
  const url = String(body.url ?? "").trim();
  const displayText = String(body.displayText ?? "").trim();

  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const attachment = await prisma.cardAttachment.create({
    data: {
      cardId,
      fileName: displayText || url,
      fileUrl: url,
      uploadedBy: dbUser.id,
    },
  });

  return NextResponse.json(attachment, { status: 201 });
}