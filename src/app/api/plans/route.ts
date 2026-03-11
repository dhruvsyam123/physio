import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const createPlanSchema = z.object({
  patientId: z.string().min(1),
  name: z.string().min(1),
  condition: z.string().min(1),
  goals: z.array(z.string()),
  status: z.string().optional(),
  phases: z.array(
    z.object({
      name: z.string(),
      weekStart: z.number(),
      weekEnd: z.number(),
      notes: z.string().optional(),
      exercises: z.array(
        z.object({
          exerciseId: z.string(),
          exerciseName: z.string(),
          sets: z.number(),
          reps: z.number(),
          holdSeconds: z.number().optional(),
          frequency: z.string(),
          notes: z.string().optional(),
        })
      ),
    })
  ),
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

  const plans = await prisma.treatmentPlan.findMany({
    where,
    include: {
      phases: {
        include: { exercises: true },
        orderBy: { weekStart: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const mapped = plans.map((p) => ({
    id: p.id,
    patientId: p.patientId,
    name: p.name,
    condition: p.condition,
    goals: p.goals,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    phases: p.phases.map((ph) => ({
      id: ph.id,
      name: ph.name,
      weekStart: ph.weekStart,
      weekEnd: ph.weekEnd,
      notes: ph.notes,
      exercises: ph.exercises.map((ex) => ({
        id: ex.id,
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseName,
        sets: ex.sets,
        reps: ex.reps,
        holdSeconds: ex.holdSeconds,
        frequency: ex.frequency,
        notes: ex.notes,
      })),
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
  const result = createPlanSchema.safeParse(body);

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
  const plan = await prisma.treatmentPlan.create({
    data: {
      patientId: data.patientId,
      name: data.name,
      condition: data.condition,
      goals: data.goals,
      status: data.status || "draft",
      phases: {
        create: data.phases.map((ph) => ({
          name: ph.name,
          weekStart: ph.weekStart,
          weekEnd: ph.weekEnd,
          notes: ph.notes,
          exercises: {
            create: ph.exercises.map((ex) => ({
              exerciseId: ex.exerciseId,
              exerciseName: ex.exerciseName,
              sets: ex.sets,
              reps: ex.reps,
              holdSeconds: ex.holdSeconds,
              frequency: ex.frequency,
              notes: ex.notes,
            })),
          },
        })),
      },
    },
    include: {
      phases: {
        include: { exercises: true },
        orderBy: { weekStart: "asc" },
      },
    },
  });

  return NextResponse.json(
    {
      id: plan.id,
      patientId: plan.patientId,
      name: plan.name,
      condition: plan.condition,
      goals: plan.goals,
      status: plan.status,
      createdAt: plan.createdAt.toISOString(),
      updatedAt: plan.updatedAt.toISOString(),
      phases: plan.phases.map((ph) => ({
        id: ph.id,
        name: ph.name,
        weekStart: ph.weekStart,
        weekEnd: ph.weekEnd,
        notes: ph.notes,
        exercises: ph.exercises.map((ex) => ({
          id: ex.id,
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseName,
          sets: ex.sets,
          reps: ex.reps,
          holdSeconds: ex.holdSeconds,
          frequency: ex.frequency,
          notes: ex.notes,
        })),
      })),
    },
    { status: 201 }
  );
}
