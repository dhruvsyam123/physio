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
  const note = await prisma.sOAPNote.findFirst({
    where: { id, patient: { therapistId: session.user.id } },
    include: { billingEntries: true },
  });

  if (!note) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: note.id,
    patientId: note.patientId,
    date: note.date.toISOString().split("T")[0],
    subjective: note.subjective,
    objective: note.objective,
    assessment: note.assessment,
    plan: note.plan,
    therapistName: note.therapistName,
    signed: note.signed,
    createdAt: note.createdAt.toISOString(),
    billingEntries: note.billingEntries.map((b) => ({
      cptCode: b.cptCode,
      description: b.description,
      units: b.units,
      timeMinutes: b.timeMinutes,
    })),
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

  const existing = await prisma.sOAPNote.findFirst({
    where: { id, patient: { therapistId: session.user.id } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = { ...body };
  if (body.date) updateData.date = new Date(body.date);
  delete updateData.billingEntries;

  const note = await prisma.sOAPNote.update({
    where: { id },
    data: updateData,
    include: { billingEntries: true },
  });

  return NextResponse.json({
    id: note.id,
    patientId: note.patientId,
    date: note.date.toISOString().split("T")[0],
    subjective: note.subjective,
    objective: note.objective,
    assessment: note.assessment,
    plan: note.plan,
    therapistName: note.therapistName,
    signed: note.signed,
    createdAt: note.createdAt.toISOString(),
    billingEntries: note.billingEntries.map((b) => ({
      cptCode: b.cptCode,
      description: b.description,
      units: b.units,
      timeMinutes: b.timeMinutes,
    })),
  });
}
