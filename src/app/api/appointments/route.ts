import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const createAppointmentSchema = z.object({
  patientId: z.string().min(1),
  patientName: z.string().min(1),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  type: z.string(),
  status: z.string().optional(),
  notes: z.string().optional(),
  location: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const patientId = searchParams.get("patientId");

  const where: Record<string, unknown> = {
    patient: { therapistId: session.user.id },
  };
  if (date) where.date = new Date(date);
  if (patientId) where.patientId = patientId;

  const appointments = await prisma.appointment.findMany({
    where,
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  const mapped = appointments.map((a) => ({
    id: a.id,
    patientId: a.patientId,
    patientName: a.patientName,
    date: a.date.toISOString().split("T")[0],
    startTime: a.startTime,
    endTime: a.endTime,
    type: a.type,
    status: a.status,
    notes: a.notes,
    location: a.location,
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const result = createAppointmentSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  // Verify patient ownership
  const patient = await prisma.patient.findFirst({
    where: { id: result.data.patientId, therapistId: session.user.id },
  });
  if (!patient) {
    return NextResponse.json({ error: "Patient not found" }, { status: 404 });
  }

  const data = result.data;
  const appointment = await prisma.appointment.create({
    data: {
      patientId: data.patientId,
      patientName: data.patientName,
      date: new Date(data.date),
      startTime: data.startTime,
      endTime: data.endTime,
      type: data.type,
      status: data.status || "scheduled",
      notes: data.notes,
      location: data.location,
    },
  });

  return NextResponse.json(
    {
      ...appointment,
      date: appointment.date.toISOString().split("T")[0],
    },
    { status: 201 }
  );
}
