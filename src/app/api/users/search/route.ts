import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim().toLowerCase() ?? "";
    const workspaceId = searchParams.get("workspaceId");

    if (q.length < 2) {
      return NextResponse.json({ users: [] });
    }

    let excludedIds: string[] = [session.user.id as string];

    if (workspaceId) {
      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: { members: { select: { userId: true } } },
      });

      const memberIds = workspace?.members.map((m: { userId: string }) => m.userId) ?? [];
      excludedIds = [...new Set([...excludedIds, ...memberIds])];
    }

    // PRISMA 7+ case-insensitive filtering
    const users = await prisma.user.findMany({
      where: {
        id: { notIn: excludedIds },
        OR: [
          { name: { contains: q, mode: undefined } },   
          { email: { contains: q, mode: undefined } },  
        ],
      },
      select: { id: true, name: true, email: true },
      take: 10,
      orderBy: { name: "asc" },
    });

    
    const filteredUsers = users.filter(
      (u: { id: string; name: string; email: string }) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );

    return NextResponse.json({ users: filteredUsers });
  } catch (error) {
    console.error("User search error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}