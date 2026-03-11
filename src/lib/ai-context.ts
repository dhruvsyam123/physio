import { usePatientStore } from "@/stores/patient-store";
import { useNoteStore } from "@/stores/note-store";
import { usePlanStore } from "@/stores/plan-store";
import { useAppointmentStore } from "@/stores/appointment-store";

function calculateAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

export function buildPatientContext(patientId: string): string {
  const patient = usePatientStore.getState().getPatientById(patientId);
  if (!patient) return "Patient not found.";

  const notes = useNoteStore.getState().getNotesByPatient(patientId);
  const plans = usePlanStore.getState().getPlansByPatient(patientId);
  const appointments = useAppointmentStore.getState().getAppointmentsByPatient(patientId);

  const age = calculateAge(patient.dateOfBirth);

  // Last 2 SOAP note summaries
  const sortedNotes = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const recentNotes = sortedNotes.slice(0, 2);
  const noteSummaries = recentNotes
    .map((n, i) => {
      const truncatedAssessment =
        n.assessment.length > 150
          ? n.assessment.substring(0, 150) + "..."
          : n.assessment;
      return `  Note ${i + 1} (${n.date}): ${truncatedAssessment}`;
    })
    .join("\n");

  // Active treatment plan
  const activePlan = plans.find((p) => p.status === "active");
  let planInfo = "No active treatment plan.";
  if (activePlan) {
    const currentWeek = Math.ceil(
      (new Date().getTime() - new Date(activePlan.createdAt).getTime()) /
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
        new Date(a.date) >= now &&
        a.status !== "cancelled" &&
        a.status !== "completed"
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const nextAppt = futureAppointments[0];
  const nextApptStr = nextAppt
    ? `${nextAppt.date} at ${nextAppt.startTime} (${nextAppt.type})`
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
