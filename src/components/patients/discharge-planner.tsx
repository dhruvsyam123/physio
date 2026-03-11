"use client";

import { useState, useMemo } from "react";
import { ClipboardCheck, Printer, CheckCircle2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { usePatientStore } from "@/stores/patient-store";
import { useOutcomeStore } from "@/stores/outcome-store";
import { usePlanStore } from "@/stores/plan-store";
import { useAppointmentStore } from "@/stores/appointment-store";
import { outcomeDefinitions } from "@/data/outcomes";

function formatDate(dateStr?: string) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface Criterion {
  label: string;
  target: string;
  current: string;
  progress: number; // 0-100
  met: boolean;
  auto: boolean; // auto-calculated vs manual
}

const conditionRedFlags: Record<string, string[]> = {
  acl: [
    "Sudden onset of knee instability or giving way",
    "Significant swelling or warmth in the knee joint",
    "Inability to bear weight",
    "Fever or signs of infection at surgical site",
    "Locking or catching sensation in the knee",
  ],
  shoulder: [
    "Sudden loss of range of motion",
    "Acute onset of severe shoulder pain",
    "Numbness or tingling in the arm or hand",
    "Visible deformity or dislocation",
    "Signs of infection (redness, warmth, drainage)",
  ],
  back: [
    "Loss of bowel or bladder control (cauda equina syndrome)",
    "Progressive weakness in the legs",
    "Saddle area numbness",
    "Severe unremitting pain despite rest",
    "Unexplained weight loss or fever",
  ],
  hip: [
    "Sudden onset of severe hip pain",
    "Inability to bear weight",
    "Leg length discrepancy or rotation change",
    "Fever or wound drainage (infection signs)",
    "Deep vein thrombosis symptoms (calf swelling, pain, warmth)",
  ],
  elbow: [
    "Sudden increase in pain or swelling",
    "Numbness or tingling in the hand or fingers",
    "Complete loss of grip strength",
    "Signs of infection (redness, warmth)",
    "Pain that does not respond to rest or medication",
  ],
  default: [
    "Sudden worsening of symptoms",
    "New onset of numbness or tingling",
    "Significant increase in pain levels",
    "Signs of infection (fever, redness, swelling)",
    "Inability to perform previously tolerated activities",
  ],
};

function getRedFlags(condition: string): string[] {
  const lower = condition.toLowerCase();
  if (lower.includes("acl") || lower.includes("knee")) return conditionRedFlags.acl;
  if (lower.includes("shoulder") || lower.includes("rotator")) return conditionRedFlags.shoulder;
  if (lower.includes("back") || lower.includes("lumbar") || lower.includes("disc")) return conditionRedFlags.back;
  if (lower.includes("hip")) return conditionRedFlags.hip;
  if (lower.includes("elbow") || lower.includes("tennis") || lower.includes("epicondyl")) return conditionRedFlags.elbow;
  return conditionRedFlags.default;
}

export function DischargePlanner({ patientId }: { patientId: string }) {
  const patient = usePatientStore((s) => s.getPatientById(patientId));
  const allOutcomes = useOutcomeStore((s) => s.outcomes);
  const outcomes = useMemo(() => allOutcomes.filter((o) => o.patientId === patientId), [allOutcomes, patientId]);
  const allPlans = usePlanStore((s) => s.plans);
  const plans = useMemo(() => allPlans.filter((p) => p.patientId === patientId), [allPlans, patientId]);
  const allAppointments = useAppointmentStore((s) => s.appointments);
  const appointments = useMemo(() => allAppointments.filter((a) => a.patientId === patientId), [allAppointments, patientId]);

  const [hepIndependent, setHepIndependent] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const criteria = useMemo((): Criterion[] => {
    if (!patient) return [];

    const result: Criterion[] = [];

    // 1. Pain < 3/10
    const painRecords = outcomes
      .filter((o) => o.type === "vas" || o.type === "nprs")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latestPain = painRecords[0]?.value ?? 10;
    const painProgress = Math.min(100, Math.round(((10 - latestPain) / 7) * 100));
    result.push({
      label: "Pain < 3/10",
      target: "< 3/10",
      current: `${latestPain}/10`,
      progress: painProgress,
      met: latestPain < 3,
      auto: true,
    });

    // 2. ROM > 90% of normal
    const romRecords = outcomes.filter((o) => o.type === "rom");
    if (romRecords.length > 0) {
      // Group by label and get latest
      const romLabels = new Set(romRecords.map((r) => r.label));
      let totalPct = 0;
      let count = 0;
      for (const label of romLabels) {
        const sorted = romRecords
          .filter((r) => r.label === label)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const latest = sorted[0]?.value ?? 0;
        // Estimate "normal" based on common values
        const normalRange = label.toLowerCase().includes("knee")
          ? 140
          : label.toLowerCase().includes("shoulder") && label.toLowerCase().includes("flexion")
            ? 170
            : label.toLowerCase().includes("shoulder") && label.toLowerCase().includes("er")
              ? 70
              : label.toLowerCase().includes("shoulder") && label.toLowerCase().includes("abduction")
                ? 180
                : label.toLowerCase().includes("hip")
                  ? 125
                  : label.toLowerCase().includes("lumbar")
                    ? 60
                    : 160;
        totalPct += (latest / normalRange) * 100;
        count++;
      }
      const avgRomPct = count > 0 ? Math.round(totalPct / count) : 0;
      result.push({
        label: "ROM > 90% of normal",
        target: "> 90%",
        current: `${avgRomPct}%`,
        progress: Math.min(100, Math.round((avgRomPct / 90) * 100)),
        met: avgRomPct >= 90,
        auto: true,
      });
    }

    // 3. Functional score > threshold
    const funcRecords = outcomes
      .filter((o) => o.type === "dash" || o.type === "oswestry")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (funcRecords.length > 0) {
      const latestScore = funcRecords[0].value;
      const scoreDef = outcomeDefinitions.find((d) => d.type === funcRecords[0].type);
      const threshold = 20; // Normal is < 20 for both DASH and Oswestry
      const progress = Math.min(
        100,
        Math.round(((100 - latestScore) / (100 - threshold)) * 100)
      );
      result.push({
        label: `${scoreDef?.name ?? "Functional Score"} < ${threshold}`,
        target: `< ${threshold}/100`,
        current: `${latestScore}/100`,
        progress,
        met: latestScore <= threshold,
        auto: true,
      });
    }

    // 4. Independent with HEP
    result.push({
      label: "Independent with HEP",
      target: "Yes",
      current: hepIndependent ? "Yes" : "No",
      progress: hepIndependent ? 100 : 0,
      met: hepIndependent,
      auto: false,
    });

    // 5. Goals met
    const activePlan = plans.find((p) => p.status === "active") ?? plans[0];
    if (activePlan && activePlan.goals.length > 0) {
      // Check if overall improvement is strong
      const improving = outcomes.length > 0;
      const goalsMet = improving && criteria.filter((c) => c.met).length >= criteria.length * 0.5;
      result.push({
        label: "Treatment goals met",
        target: "All goals",
        current: goalsMet
          ? "Goals progressing well"
          : "In progress",
        progress: goalsMet ? 100 : 60,
        met: goalsMet,
        auto: true,
      });
    }

    return result;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient, outcomes, plans, hepIndependent]);

  const dischargeReadiness = useMemo(() => {
    if (criteria.length === 0) return 0;
    const metCount = criteria.filter((c) => c.met).length;
    return Math.round((metCount / criteria.length) * 100);
  }, [criteria]);

  if (!patient) return null;

  const completedAppts = appointments
    .filter((a) => a.status === "completed")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstDate = completedAppts[0]?.date ?? patient.createdAt;
  const lastDate =
    completedAppts[completedAppts.length - 1]?.date ?? patient.lastVisit;
  const redFlags = getRedFlags(patient.condition);

  return (
    <div className="flex flex-col gap-6">
      {/* Discharge Readiness */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ClipboardCheck className="size-5 text-primary" />
            <div>
              <CardTitle>Discharge Readiness</CardTitle>
              <CardDescription>
                Overall readiness based on discharge criteria
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Progress value={dischargeReadiness}>
              <ProgressLabel>Discharge Readiness</ProgressLabel>
              <ProgressValue>
                {() => `${dischargeReadiness}%`}
              </ProgressValue>
            </Progress>
          </div>
          <div
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              dischargeReadiness >= 80
                ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                : dischargeReadiness >= 50
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                  : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
            }`}
          >
            {dischargeReadiness >= 80
              ? "Patient approaching discharge readiness"
              : dischargeReadiness >= 50
                ? "Patient progressing well, continue treatment"
                : "Patient requires continued intervention"}
          </div>
        </CardContent>
      </Card>

      {/* Criteria Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Discharge Criteria Checklist</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {criteria.map((c, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {!c.auto ? (
                    <input
                      type="checkbox"
                      checked={c.met}
                      onChange={() => setHepIndependent(!hepIndependent)}
                      className="size-4 rounded border-input accent-primary"
                    />
                  ) : (
                    <CheckCircle2
                      className={`size-4 ${
                        c.met ? "text-green-600" : "text-muted-foreground"
                      }`}
                    />
                  )}
                  <span className="text-sm font-medium">{c.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Current: {c.current} / Target: {c.target}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all ${
                    c.met
                      ? "bg-green-500"
                      : c.progress >= 70
                        ? "bg-amber-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, c.progress))}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Generate Discharge Summary */}
      <div className="flex items-center gap-2 print:hidden">
        <Button onClick={() => setShowSummary(!showSummary)}>
          <FileText className="size-3.5" />
          {showSummary ? "Hide" : "Generate"} Discharge Summary
        </Button>
      </div>

      {showSummary && (
        <Card className="print:shadow-none print:border-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle>Discharge Summary</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.print()}
                className="print:hidden"
              >
                <Printer className="size-3.5" />
                Print
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-5 pt-6 text-sm">
            {/* Patient Info */}
            <section>
              <h3 className="mb-1 font-semibold">Patient Information</h3>
              <p>
                {patient.firstName} {patient.lastName} &mdash;{" "}
                {patient.condition}
              </p>
              <p className="text-muted-foreground">
                Treatment Period: {formatDate(firstDate)} to{" "}
                {formatDate(lastDate)} ({patient.totalSessions} sessions)
              </p>
            </section>

            {/* Goals Achieved */}
            <section>
              <h3 className="mb-1 font-semibold">Discharge Criteria Status</h3>
              <ul className="list-disc pl-5 space-y-1">
                {criteria.map((c, i) => (
                  <li key={i}>
                    {c.label}: {c.current}{" "}
                    {c.met ? "(Met)" : "(In Progress)"}
                  </li>
                ))}
              </ul>
            </section>

            {/* Home Exercise Programme */}
            <section>
              <h3 className="mb-1 font-semibold">Home Exercise Programme</h3>
              <p>
                {hepIndependent
                  ? "Patient is independent with their home exercise programme and demonstrates correct technique for all prescribed exercises."
                  : "Patient to continue prescribed home exercise programme. A written programme has been provided with illustrations and exercise parameters."}
              </p>
            </section>

            {/* Follow-up Recommendations */}
            <section>
              <h3 className="mb-1 font-semibold">Follow-up Recommendations</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Continue home exercise programme as prescribed for a minimum
                  of 6 weeks post-discharge.
                </li>
                <li>
                  Follow up with referring practitioner within 4 weeks of
                  discharge.
                </li>
                <li>
                  Return to physiotherapy if symptoms return or worsen beyond
                  expected levels.
                </li>
                <li>
                  Gradual return to full activities over 2-4 weeks as
                  tolerated.
                </li>
              </ul>
            </section>

            {/* Red Flags */}
            <section>
              <h3 className="mb-1 font-semibold text-red-600 dark:text-red-400">
                Red Flags - Seek Immediate Medical Attention
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-red-700 dark:text-red-400">
                {redFlags.map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            </section>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Small exported component for overview tab use
export function DischargeReadinessCard({ patientId }: { patientId: string }) {
  const patient = usePatientStore((s) => s.getPatientById(patientId));
  const allOutcomes = useOutcomeStore((s) => s.outcomes);
  const outcomes = useMemo(() => allOutcomes.filter((o) => o.patientId === patientId), [allOutcomes, patientId]);

  const readiness = useMemo(() => {
    if (!patient || outcomes.length === 0) return null;

    let criteriaMet = 0;
    let totalCriteria = 0;

    // Pain check
    const painRecords = outcomes
      .filter((o) => o.type === "vas" || o.type === "nprs")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (painRecords.length > 0) {
      totalCriteria++;
      if (painRecords[0].value < 3) criteriaMet++;
    }

    // ROM check
    const romRecords = outcomes.filter((o) => o.type === "rom");
    if (romRecords.length > 0) {
      totalCriteria++;
      const romLabels = new Set(romRecords.map((r) => r.label));
      let totalPct = 0;
      let count = 0;
      for (const label of romLabels) {
        const sorted = romRecords
          .filter((r) => r.label === label)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const latest = sorted[0]?.value ?? 0;
        const normalRange = label.toLowerCase().includes("knee")
          ? 140
          : label.toLowerCase().includes("shoulder")
            ? 170
            : label.toLowerCase().includes("hip")
              ? 125
              : 160;
        totalPct += (latest / normalRange) * 100;
        count++;
      }
      if (count > 0 && totalPct / count >= 90) criteriaMet++;
    }

    // Functional score check
    const funcRecords = outcomes
      .filter((o) => o.type === "dash" || o.type === "oswestry")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (funcRecords.length > 0) {
      totalCriteria++;
      if (funcRecords[0].value <= 20) criteriaMet++;
    }

    if (totalCriteria === 0) return null;
    return Math.round((criteriaMet / totalCriteria) * 100);
  }, [patient, outcomes]);

  if (readiness === null) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Discharge Readiness</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${
                readiness >= 80
                  ? "bg-green-500"
                  : readiness >= 50
                    ? "bg-amber-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${readiness}%` }}
            />
          </div>
          <span className="text-sm font-medium">{readiness}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
