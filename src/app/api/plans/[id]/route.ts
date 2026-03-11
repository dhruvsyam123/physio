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
  const plan = await prisma.treatmentPlan.findFirst({
    where: { id, patient: { therapistId: session.user.id } },
    include: {
      phases: {
        include: { exercises: true },
        orderBy: { weekStart: "asc" },
      },
    },
  });

  if (!plan) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
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

  const existing = await prisma.treatmentPlan.findFirst({
    where: { id, patient: { therapistId: session.user.id } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { phases, ...planData } = body;
  const updateData: Record<string, unknown> = { ...planData };

  const plan = await prisma.treatmentPlan.update({
    where: { id },
    data: updateData,
    include: {
      phases: {
        include: { exercises: true },
        orderBy: { weekStart: "asc" },
      },
    },
  });

  return NextResponse.json({
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
  const existing = await prisma.treatmentPlan.findFirst({
    where: { id, patient: { therapistId: session.user.id } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.treatmentPlan.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
