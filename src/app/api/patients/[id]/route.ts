import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const patient = await prisma.patient.findFirst({
    where: { id, therapistId: session.user.id },
  });

  if (!patient) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...patient,
    dateOfBirth: patient.dateOfBirth.toISOString().split("T")[0],
    createdAt: patient.createdAt.toISOString(),
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // Verify ownership
  const existing = await prisma.patient.findFirst({
    where: { id, therapistId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = { ...body };
  if (body.dateOfBirth) {
    updateData.dateOfBirth = new Date(body.dateOfBirth);
  }

  const patient = await prisma.patient.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({
    ...patient,
    dateOfBirth: patient.dateOfBirth.toISOString().split("T")[0],
    createdAt: patient.createdAt.toISOString(),
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.patient.findFirst({
    where: { id, therapistId: session.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.patient.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
