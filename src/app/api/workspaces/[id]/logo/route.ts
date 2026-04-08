import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { randomUUID } from "crypto";
import { writeFile, mkdir, unlink, readdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

/* ------------------ POST ------------------ */

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("logo") as File;
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only images allowed" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "workspaces", id);
  await mkdir(uploadDir, { recursive: true });

  try {
    const existing = await readdir(uploadDir);
    await Promise.all(
      existing
        .filter(f => f.startsWith("logo-"))
        .map(f => unlink(path.join(uploadDir, f)))
    );
  } catch {
  }

  const ext = file.name.split(".").pop();
  const filename = `logo-${randomUUID()}.${ext}`;
  const filepath = path.join(uploadDir, filename);

  const bytes = await file.arrayBuffer();
  await writeFile(filepath, Buffer.from(bytes));

  const logo = `/uploads/workspaces/${id}/${filename}`;

  const workspace = await prisma.workspace.update({
    where: { id },
    data: { logo },
  });

  return NextResponse.json({ workspace });
}

/* ------------------ DELETE ------------------ */

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "workspaces", id);

  try {
    const files = await readdir(uploadDir);
    await Promise.all(files.map(file => unlink(path.join(uploadDir, file))));
  } catch {
  }

  const workspace = await prisma.workspace.update({
    where: { id },
    data: { logo: null },
  });

  return NextResponse.json({ workspace });
}