import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const createOutcomeSchema = z.object({
  patientId: z.string().min(1),
  type: z.string().min(1),
  label: z.string().min(1),
  value: z.number(),
  unit: z.string().min(1),
  date: z.string(),
  notes: z.string().optional(),
  bodyRegion: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get("patientId");
  const type = searchParams.get("type");

  const where: Record<string, unknown> = {
    patient: { therapistId: session.user.id },
  };
  if (patientId) where.patientId = patientId;
  if (type) where.type = type;

  const outcomes = await prisma.outcomeRecord.findMany({
    where,
    orderBy: { date: "asc" },
  });

  const mapped = outcomes.map((o) => ({
    id: o.id,
    patientId: o.patientId,
    type: o.type,
    label: o.label,
    value: o.value,
    unit: o.unit,
    date: o.date.toISOString().split("T")[0],
    notes: o.notes,
    bodyRegion: o.bodyRegion,
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const result = createOutcomeSchema.safeParse(body);

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
  const outcome = await prisma.outcomeRecord.create({
    data: {
      patientId: data.patientId,
      type: data.type,
      label: data.label,
      value: data.value,
      unit: data.unit,
      date: new Date(data.date),
      notes: data.notes,
      bodyRegion: data.bodyRegion,
    },
  });

  return NextResponse.json(
    {
      ...outcome,
      date: outcome.date.toISOString().split("T")[0],
    },
    { status: 201 }
  );
}
