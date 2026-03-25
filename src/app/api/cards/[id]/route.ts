import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* ------------------ GET ------------------ */

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const card = await prisma.card.findUnique({
      where: { id },
      include: {
        labels: {
          include: {
            boardLabel: true,
          },
        },
        links: true,
        comments: true,
        column: {
          include: {
            board: {
              include: {
                labels: true,
              },
            },
          },
        },
      },
    });

    if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });

    return NextResponse.json({
      ...card,
      labels: card?.labels.map((item: { boardLabel: { id: string; color: string; name?: string } }) => ({
        id: item.boardLabel.id,
        color: item.boardLabel.color,
        name: item.boardLabel.name,
        checked: true,
      })) ?? [],
      boardLabels: card?.column.board.labels.map((label: { id: string; color: string; name?: string }) => ({
        id: label.id,
        color: label.color,
        name: label.name,
      })) ?? [],
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/* ------------------ PATCH ------------------ */

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, position, hasDescription, watching, dueDate, labels } = body;

    const labelsProvided = Array.isArray(labels);

    const updatedCard = await prisma.card.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(position !== undefined && { position }),
        ...(hasDescription !== undefined && { hasDescription }),
        ...(watching !== undefined && { watching }),
        ...(dueDate !== undefined && { dueDate: dueDate !== null ? new Date(dueDate) : null }),
        ...(labelsProvided && {
          labels: {
            deleteMany: {},
            create: labels.map((label: any) => ({
              boardLabel: { connect: { id: label.id } },
            })),
          }
        }),
      },
    });

    // create: labels.filter(l => !l.id).map(l => ({ text: l.text, color: l.color }))
    return NextResponse.json(updatedCard);
  } catch (error: any) {
    console.error(error);

    if (error.code === "P2025") {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}