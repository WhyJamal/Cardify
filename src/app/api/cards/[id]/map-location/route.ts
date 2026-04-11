import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* ------------------ POST ------------------ */

export async function POST(
  req: Request,
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

  const { id } = await params;
  const body = await req.json();
  const { name, fullAddress, lat, lng } = body.location;

  const card = await prisma.card.findUnique({
    where: { id },
    select: { locationId: true },
  });

  if (!card) {
    return NextResponse.json({ error: "Card not found" }, { status: 404 });
  }

  let location;

  if (card.locationId) {
    location = await prisma.location.update({
      where: { id: card.locationId },
      data: { name, fullAddress, lat, lng },
    });
  } else {
    location = await prisma.location.create({
      data: {
        name,
        fullAddress,
        lat,
        lng,
        card: { connect: { id } },
      },
    });
  }

  return NextResponse.json(location);
}

/* ------------------ DELETE ------------------ */

export async function DELETE(
  _req: Request,
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

  const { id } = await params;

  const card = await prisma.card.findUnique({
    where: { id },
    select: { locationId: true },
  });

  if (!card?.locationId) {
    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  }

  await prisma.location.delete({ where: { id: card.locationId } });

  return NextResponse.json({ success: true });
}