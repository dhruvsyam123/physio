import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { mockExercises } from "../src/data/exercises";
import { mockPatients } from "../src/data/patients";
import { mockAppointments } from "../src/data/appointments";
import { mockNotes } from "../src/data/notes";
import { mockPlans } from "../src/data/plans";
import { mockConversations } from "../src/data/messages";
import { mockReferrals } from "../src/data/referrals";
import { mockOutcomes } from "../src/data/outcomes";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding exercises...");
  for (const ex of mockExercises) {
    await prisma.exercise.upsert({
      where: { id: ex.id },
      update: {},
      create: {
        id: ex.id,
        name: ex.name,
        description: ex.description,
        bodyRegion: ex.bodyRegion,
        category: ex.category,
        difficulty: ex.difficulty,
        equipment: ex.equipment,
        imageUrl: ex.imageUrl,
        videoUrl: ex.videoUrl,
        instructions: ex.instructions,
        sets: ex.sets,
        reps: ex.reps,
        holdSeconds: ex.holdSeconds,
        duration: ex.duration,
        targetMuscles: ex.targetMuscles || [],
        bestFor: ex.bestFor,
        tips: ex.tips || [],
      },
    });
  }
  console.log(`Seeded ${mockExercises.length} exercises`);

  // Create demo user
  const passwordHash = await bcrypt.hash("demo123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@physioai.com" },
    update: {},
    create: {
      id: "demo-user-1",
      name: "Dr. Sarah Mitchell",
      email: "demo@physioai.com",
      passwordHash,
      clinicName: "PhysioAI Clinic",
    },
  });
  console.log(`Created demo user: ${user.email}`);

  // Seed patients
  console.log("Seeding patients...");
  for (const p of mockPatients) {
    await prisma.patient.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        therapistId: user.id,
        firstName: p.firstName,
        lastName: p.lastName,
        email: p.email,
        phone: p.phone,
        dateOfBirth: new Date(p.dateOfBirth),
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
      },
    });
  }
  console.log(`Seeded ${mockPatients.length} patients`);

  // Seed appointments
  console.log("Seeding appointments...");
  for (const a of mockAppointments) {
    await prisma.appointment.upsert({
      where: { id: a.id },
      update: {},
      create: {
        id: a.id,
        patientId: a.patientId,
        patientName: a.patientName,
        date: new Date(a.date),
        startTime: a.startTime,
        endTime: a.endTime,
        type: a.type,
        status: a.status,
        notes: a.notes,
        location: a.location,
      },
    });
  }
  console.log(`Seeded ${mockAppointments.length} appointments`);

  // Seed SOAP notes
  console.log("Seeding SOAP notes...");
  for (const n of mockNotes) {
    await prisma.sOAPNote.upsert({
      where: { id: n.id },
      update: {},
      create: {
        id: n.id,
        patientId: n.patientId,
        date: new Date(n.date),
        subjective: n.subjective,
        objective: n.objective,
        assessment: n.assessment,
        plan: n.plan,
        therapistName: n.therapistName,
        signed: n.signed,
      },
    });
  }
  console.log(`Seeded ${mockNotes.length} SOAP notes`);

  // Seed treatment plans
  console.log("Seeding treatment plans...");
  for (const plan of mockPlans) {
    await prisma.treatmentPlan.upsert({
      where: { id: plan.id },
      update: {},
      create: {
        id: plan.id,
        patientId: plan.patientId,
        name: plan.name,
        condition: plan.condition,
        goals: plan.goals,
        status: plan.status,
        phases: {
          create: plan.phases.map((ph) => ({
            id: ph.id,
            name: ph.name,
            weekStart: ph.weekStart,
            weekEnd: ph.weekEnd,
            notes: ph.notes,
            exercises: {
              create: ph.exercises.map((ex) => ({
                id: ex.id,
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
    });
  }
  console.log(`Seeded ${mockPlans.length} treatment plans`);

  // Seed conversations and messages
  console.log("Seeding conversations...");
  for (const conv of mockConversations) {
    await prisma.conversation.upsert({
      where: { id: conv.id },
      update: {},
      create: {
        id: conv.id,
        patientId: conv.patientId,
        patientName: conv.patientName,
        patientAvatar: conv.patientAvatar,
        lastMessage: conv.lastMessage,
        lastMessageTime: new Date(conv.lastMessageTime),
        unreadCount: conv.unreadCount,
        messages: {
          create: conv.messages.map((m) => ({
            id: m.id,
            senderId: m.senderId,
            senderName: m.senderName,
            senderRole: m.senderRole,
            content: m.content,
            read: m.read,
            createdAt: new Date(m.timestamp),
          })),
        },
      },
    });
  }
  console.log(`Seeded ${mockConversations.length} conversations`);

  // Seed referrals
  console.log("Seeding referrals...");
  for (const r of mockReferrals) {
    await prisma.referral.upsert({
      where: { id: r.id },
      update: {},
      create: {
        id: r.id,
        patientId: r.patientName ? undefined : undefined, // referrals may not be linked
        patientName: r.patientName,
        referrerName: r.referrerName,
        referrerType: r.referrerType,
        date: new Date(r.date),
        condition: r.condition,
        rawText: r.rawText,
        status: r.status,
        parsedData: r.parsedData ? (r.parsedData as object) : undefined,
      },
    });
  }
  console.log(`Seeded ${mockReferrals.length} referrals`);

  // Seed outcomes
  console.log("Seeding outcomes...");
  for (const o of mockOutcomes) {
    await prisma.outcomeRecord.upsert({
      where: { id: o.id },
      update: {},
      create: {
        id: o.id,
        patientId: o.patientId,
        type: o.type,
        label: o.label,
        value: o.value,
        unit: o.unit,
        date: new Date(o.date),
        notes: o.notes,
        bodyRegion: o.bodyRegion,
      },
    });
  }
  console.log(`Seeded ${mockOutcomes.length} outcome records`);

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
