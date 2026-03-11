import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const createNoteSchema = z.object({
  patientId: z.string().min(1),
  date: z.string(),
  subjective: z.string().min(1),
  objective: z.string().min(1),
  assessment: z.string().min(1),
  plan: z.string().min(1),
  therapistName: z.string().min(1),
  signed: z.boolean().optional(),
  billingEntries: z
    .array(
      z.object({
        cptCode: z.string(),
        description: z.string(),
        units: z.number(),
        timeMinutes: z.number(),
      })
    )
    .optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get("patientId");

  const where: Record<string, unknown> = {
    patient: { therapistId: session.user.id },
  };
  if (patientId) where.patientId = patientId;

  const notes = await prisma.sOAPNote.findMany({
    where,
    include: { billingEntries: true },
    orderBy: { createdAt: "desc" },
  });

  const mapped = notes.map((n) => ({
    id: n.id,
    patientId: n.patientId,
    date: n.date.toISOString().split("T")[0],
    subjective: n.subjective,
    objective: n.objective,
    assessment: n.assessment,
    plan: n.plan,
    therapistName: n.therapistName,
    signed: n.signed,
    createdAt: n.createdAt.toISOString(),
    billingEntries: n.billingEntries.map((b) => ({
      cptCode: b.cptCode,
      description: b.description,
      units: b.units,
      timeMinutes: b.timeMinutes,
    })),
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const result = createNoteSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const patient = await prisma.patient.findFirst({
    where: { id: result.data.patientId, therapistId: session.user.id },
  });
  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  const data = result.data;
  const note = await prisma.sOAPNote.create({
    data: {
      patientId: data.patientId,
      date: new Date(data.date),
      subjective: data.subjective,
      objective: data.objective,
      assessment: data.assessment,
      plan: data.plan,
      therapistName: data.therapistName,
      signed: data.signed ?? false,
      billingEntries: data.billingEntries
        ? {
            create: data.billingEntries.map((b) => ({
              cptCode: b.cptCode,
              description: b.description,
              units: b.units,
              timeMinutes: b.timeMinutes,
            })),
          }
        : undefined,
    },
    include: { billingEntries: true },
  });

  return NextResponse.json(
    {
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
    },
    { status: 201 }
  );
}
