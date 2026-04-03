import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", "covers");
    await mkdir(uploadDir, { recursive: true });

    const filename = `${id}-${Date.now()}-${file.name.replace(/\s/g, "_")}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const url = `/uploads/covers/${filename}`;

    await prisma.card.update({
        where: { id },
        data: { background: url, isImage: true },
    });

    return NextResponse.json({ url });
}