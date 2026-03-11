"use client";

import { useState, useMemo } from "react";
import { FileText, Printer, Lock, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePatient } from "@/hooks/use-patients";
import { useNotesByPatient } from "@/hooks/use-notes";
import { usePlansByPatient } from "@/hooks/use-plans";
import { useAppointmentsByPatient } from "@/hooks/use-appointments";
import { useOutcomesByPatient } from "@/hooks/use-outcomes";
import { outcomeDefinitions } from "@/data/outcomes";
import type { MeasureType } from "@/types/outcomes";

function formatDate(dateStr?: string) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ProgressReport({ patientId }: { patientId: string }) {
  const { data: patient } = usePatient(patientId);
  const { data: notes = [] } = useNotesByPatient(patientId);
  const { data: plans = [] } = usePlansByPatient(patientId);
  const { data: appointments = [] } = useAppointmentsByPatient(patientId);
  const { data: outcomes = [] } = useOutcomesByPatient(patientId);

  const [generated, setGenerated] = useState(false);
  const [signed, setSigned] = useState(false);

  const report = useMemo(() => {
    if (!patient) return null;

    // Treatment period
    const completedAppts = appointments
      .filter((a) => a.status === "completed")
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    const firstApptDate = completedAppts[0]?.date ?? patient.createdAt;
    const lastApptDate =
      completedAppts[completedAppts.length - 1]?.date ?? patient.lastVisit;
    const sessionCount = completedAppts.length || patient.totalSessions;

    // Outcomes - initial vs latest
    const labelGroups = new Map<
      string,
      { type: MeasureType; label: string; initial: number; latest: number; unit: string; pctChange: number }
    >();
    for (const o of outcomes) {
      const key = `${o.type}::${o.label}`;
      if (!labelGroups.has(key)) {
        labelGroups.set(key, {
          type: o.type as MeasureType,
          label: o.label,
          initial: o.value,
          latest: o.value,
          unit: o.unit,
          pctChange: 0,
        });
      }
    }
    for (const o of outcomes) {
      const key = `${o.type}::${o.label}`;
      const group = labelGroups.get(key)!;
      const sorted = outcomes
        .filter((r) => r.type === o.type && r.label === o.label)
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      group.initial = sorted[0].value;
      group.latest = sorted[sorted.length - 1].value;
      const def = outcomeDefinitions.find((d) => d.type === o.type);
      const lowerIsBetter = def?.lowerIsBetter ?? false;
      if (group.initial !== 0) {
        group.pctChange = lowerIsBetter
          ? Math.round(
              ((group.initial - group.latest) / group.initial) * 100
            )
          : Math.round(
              ((group.latest - group.initial) / group.initial) * 100
            );
      }
    }

    // Recent plan sections from SOAP notes
    const recentNotes = [...notes]
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 5);
    const treatmentSummaries = recentNotes.map((n) => n.plan);

    // Goal progress
    const activePlan = plans.find((p) => p.status === "active") ?? plans[0];
    const goalProgress = (activePlan?.goals ?? []).map((goal) => {
      // Simple heuristic: if outcomes show improvement, mark as progressing or met
      const improving = Array.from(labelGroups.values()).filter(
        (g) => g.pctChange > 20
      );
      if (improving.length > labelGroups.size * 0.7) return { goal, status: "Met" as const };
      if (improving.length > 0) return { goal, status: "Progressing" as const };
      return { goal, status: "Not Met" as const };
    });

    return {
      patient,
      firstApptDate,
      lastApptDate,
      sessionCount,
      outcomes: Array.from(labelGroups.values()),
      treatmentSummaries,
      goalProgress,
      activePlan,
    };
  }, [patient, appointments, outcomes, notes, plans]);

  if (!patient) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSign = () => {
    setSigned(true);
  };

  return (
    <div className="flex flex-col gap-4">
      {!generated ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-8">
            <FileText className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Generate a comprehensive progress report for this patient.
            </p>
            <Button onClick={() => setGenerated(true)}>
              <FileText className="size-3.5" />
              Generate Progress Report
            </Button>
          </CardContent>
        </Card>
      ) : report ? (
        <div className="flex flex-col gap-4">
          {/* Action bar */}
          <div className="flex items-center justify-end gap-2 print:hidden">
            <Button size="sm" variant="outline" onClick={handlePrint}>
              <Printer className="size-3.5" />
              Print / Export
            </Button>
            {!signed ? (
              <Button size="sm" onClick={handleSign}>
                <Lock className="size-3.5" />
                Sign & Lock
              </Button>
            ) : (
              <Badge variant="default" className="gap-1">
                <Check className="size-3" />
                Signed & Locked
              </Badge>
            )}
          </div>

          {/* Report Card */}
          <Card className="print:shadow-none print:border-none">
            <CardHeader className="border-b">
              <CardTitle className="text-lg">Progress Report</CardTitle>
              <CardDescription>
                {report.patient.firstName} {report.patient.lastName} &mdash;{" "}
                {report.patient.condition}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* Demographics */}
              <section>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Patient Demographics
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>{" "}
                    {report.patient.firstName} {report.patient.lastName}
                  </div>
                  <div>
                    <span className="text-muted-foreground">DOB:</span>{" "}
                    {formatDate(report.patient.dateOfBirth)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Condition:</span>{" "}
                    {report.patient.condition}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Insurance:</span>{" "}
                    {report.patient.insuranceProvider ?? "N/A"}
                  </div>
                </div>
              </section>

              {/* Treatment Period */}
              <section>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Treatment Period
                </h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Start:</span>{" "}
                    {formatDate(report.firstApptDate)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Latest:</span>{" "}
                    {formatDate(report.lastApptDate)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sessions:</span>{" "}
                    {report.sessionCount}
                  </div>
                </div>
              </section>

              {/* Objective Outcomes */}
              {report.outcomes.length > 0 && (
                <section>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Objective Outcomes
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-left text-xs text-muted-foreground">
                          <th className="pb-2 pr-4">Measure</th>
                          <th className="pb-2 pr-4">Initial</th>
                          <th className="pb-2 pr-4">Latest</th>
                          <th className="pb-2">Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.outcomes.map((o) => (
                          <tr key={o.label} className="border-b last:border-0">
                            <td className="py-2 pr-4 font-medium">{o.label}</td>
                            <td className="py-2 pr-4">
                              {o.initial}
                              {o.unit}
                            </td>
                            <td className="py-2 pr-4">
                              {o.latest}
                              {o.unit}
                            </td>
                            <td className="py-2">
                              <span
                                className={
                                  o.pctChange > 0
                                    ? "text-green-600"
                                    : o.pctChange < 0
                                      ? "text-red-600"
                                      : ""
                                }
                              >
                                {o.pctChange > 0 ? "+" : ""}
                                {o.pctChange}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Treatment Provided */}
              {report.treatmentSummaries.length > 0 && (
                <section>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Treatment Provided (Recent Sessions)
                  </h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {report.treatmentSummaries.map((plan, i) => (
                      <li key={i} className="line-clamp-2">
                        {plan}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Goal Progress */}
              {report.goalProgress.length > 0 && (
                <section>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Goal Progress
                  </h3>
                  <div className="flex flex-col gap-2">
                    {report.goalProgress.map((g, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                      >
                        <span>{g.goal}</span>
                        <Badge
                          variant={
                            g.status === "Met"
                              ? "default"
                              : g.status === "Progressing"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {g.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Plan of Care */}
              {report.activePlan && (
                <section>
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Plan of Care
                  </h3>
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Current Plan:</span>{" "}
                      {report.activePlan.name}
                    </p>
                    <p className="mt-1">
                      <span className="font-medium">Phases:</span>{" "}
                      {report.activePlan.phases.length} phase
                      {report.activePlan.phases.length !== 1 ? "s" : ""} planned
                    </p>
                    {report.activePlan.phases.map((phase) => (
                      <p key={phase.id} className="ml-4 text-xs text-muted-foreground">
                        {phase.name} (Weeks {phase.weekStart}-{phase.weekEnd})
                      </p>
                    ))}
                  </div>
                </section>
              )}

              {/* Medical Necessity */}
              <section>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Medical Necessity Statement
                </h3>
                <p className="text-sm leading-relaxed">
                  Continued skilled physical therapy services are medically
                  necessary to address{" "}
                  {report.patient.condition.toLowerCase()}. The patient has
                  demonstrated measurable improvements in pain levels, range of
                  motion, and functional capacity over {report.sessionCount}{" "}
                  treatment sessions. Ongoing skilled intervention is required
                  to achieve optimal functional outcomes and prevent regression
                  of gains. The complexity of the condition requires the
                  expertise of a licensed physical therapist to safely progress
                  the treatment plan and ensure appropriate load management.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
