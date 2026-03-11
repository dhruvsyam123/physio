import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const createPatientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  dateOfBirth: z.string(),
  gender: z.string(),
  address: z.string().min(1),
  condition: z.string().min(1),
  status: z.string().optional(),
  avatar: z.string().optional(),
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const patients = await prisma.patient.findMany({
    where: { therapistId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  // Map to frontend format
  const mapped = patients.map((p) => ({
    id: p.id,
    firstName: p.firstName,
    lastName: p.lastName,
    email: p.email,
    phone: p.phone,
    dateOfBirth: p.dateOfBirth.toISOString().split("T")[0],
    gender: p.gender,
    address: p.address,
    condition: p.condition,
    status: p.status,
    avatar: p.avatar,
    insuranceProvider: p.insuranceProvider,
    insuranceNumber: p.insuranceNumber,
    emergencyContact: p.emergencyContact,
    emergencyPhone: p.emergencyPhone,
    notes: p.notes,
    totalSessions: p.totalSessions,
    completionRate: p.completionRate,
    createdAt: p.createdAt.toISOString(),
  }));

  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const result = createPatientSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 }
    );
  }

  const data = result.data;
  const patient = await prisma.patient.create({
    data: {
      therapistId: session.user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: new Date(data.dateOfBirth),
      gender: data.gender,
      address: data.address,
      condition: data.condition,
      status: data.status || "new",
      avatar: data.avatar,
      insuranceProvider: data.insuranceProvider,
      insuranceNumber: data.insuranceNumber,
      emergencyContact: data.emergencyContact,
      emergencyPhone: data.emergencyPhone,
      notes: data.notes,
    },
  });

  return NextResponse.json(
    {
      ...patient,
      dateOfBirth: patient.dateOfBirth.toISOString().split("T")[0],
      createdAt: patient.createdAt.toISOString(),
    },
    { status: 201 }
  );
}
