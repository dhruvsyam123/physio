import { prisma } from "@/lib/prisma";

function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export async function buildPatientContext(patientId: string): Promise<string> {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
  });
  if (!patient) return "Patient not found.";

  const notes = await prisma.sOAPNote.findMany({
    where: { patientId },
    orderBy: { createdAt: "desc" },
    take: 2,
  });

  const plans = await prisma.treatmentPlan.findMany({
    where: { patientId },
    include: { phases: true },
  });

  const appointments = await prisma.appointment.findMany({
    where: { patientId },
  });

  const age = calculateAge(patient.dateOfBirth);

  // Last 2 SOAP note summaries
  const noteSummaries = notes
    .map((n, i) => {
      const truncatedAssessment =
        n.assessment.length > 150
          ? n.assessment.substring(0, 150) + "..."
          : n.assessment;
      return `  Note ${i + 1} (${n.date.toISOString().split("T")[0]}): ${truncatedAssessment}`;
    })
    .join("\n");

  // Active treatment plan
  const activePlan = plans.find((p) => p.status === "active");
  let planInfo = "No active treatment plan.";
  if (activePlan) {
    const currentWeek = Math.ceil(
      (new Date().getTime() - activePlan.createdAt.getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    );
    const currentPhase = activePlan.phases.find(
      (ph) => currentWeek >= ph.weekStart && currentWeek <= ph.weekEnd
    );
    planInfo = `${activePlan.name} - Current phase: ${currentPhase?.name ?? "Between phases"} (Week ${currentWeek})`;
  }

  // Next appointment
  const now = new Date();
  const futureAppointments = appointments
    .filter(
      (a) =>
        a.date >= now &&
        a.status !== "cancelled" &&
        a.status !== "completed"
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  const nextAppt = futureAppointments[0];
  const nextApptStr = nextAppt
    ? `${nextAppt.date.toISOString().split("T")[0]} at ${nextAppt.startTime} (${nextAppt.type})`
    : "No upcoming appointments";

  const lines = [
    `Patient: ${patient.firstName} ${patient.lastName}`,
    `Age: ${age} | Gender: ${patient.gender} | Status: ${patient.status}`,
    `Condition: ${patient.condition}`,
    `Total Sessions: ${patient.totalSessions} | Completion Rate: ${patient.completionRate}%`,
    ``,
    `Recent SOAP Notes:`,
    noteSummaries || "  No previous notes.",
    ``,
    `Treatment Plan: ${planInfo}`,
    `Next Appointment: ${nextApptStr}`,
  ];

  return lines.join("\n");
}
