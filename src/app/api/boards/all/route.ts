import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
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

    const workspaces = await prisma.workspace.findMany({
        where: {
            OR: [
                { ownerId: dbUser.id },
                { members: { some: { userId: dbUser.id } } },
            ],
        },
        select: {
            id: true,
            name: true,
            boards: {
                select: {
                    id: true,
                    title: true,
                    columns: {
                        select: {
                            id: true,
                            title: true,
                            _count: { select: { cards: true } },
                        },
                        orderBy: { position: "asc" },
                    },
                },
                orderBy: { createdAt: "desc" },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ workspaces });
}