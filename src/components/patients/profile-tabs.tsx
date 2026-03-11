"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  FileText,
  ClipboardList,
  MessageSquare,
  Plus,
  GitCompareArrows,
  Copy,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNotesByPatient } from "@/hooks/use-notes";
import { usePlansByPatient } from "@/hooks/use-plans";
import { useAppointmentsByPatient } from "@/hooks/use-appointments";
import { useConversations } from "@/hooks/use-conversations";
import { useOutcomesByPatient } from "@/hooks/use-outcomes";
import { ProgressCharts } from "@/components/patients/progress-charts";
import { AIProgressSummary } from "@/components/patients/ai-progress-summary";
import { DischargeReadinessCard } from "@/components/patients/discharge-planner";
import { ProgressReport } from "@/components/patients/progress-report";
import { outcomeDefinitions } from "@/data/outcomes";
import type { Patient, SOAPNote } from "@/types";

function formatDate(dateStr?: string) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timeStr: string) {
  return timeStr;
}

const appointmentTypeLabel: Record<string, string> = {
  "initial-assessment": "Initial Assessment",
  "follow-up": "Follow-up",
  treatment: "Treatment",
  review: "Review",
  discharge: "Discharge",
};

const appointmentStatusVariant: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  scheduled: "outline",
  confirmed: "default",
  "in-progress": "secondary",
  completed: "default",
  cancelled: "destructive",
  "no-show": "destructive",
};

// ---------- OVERVIEW TAB ----------
function OverviewTab({ patient }: { patient: Patient }) {
  const { data: outcomes = [] } = useOutcomesByPatient(patient.id);

  // Compute quick summary from outcome store
  const outcomeSummary = useMemo(() => {
    if (outcomes.length === 0) return null;

    // Latest VAS/NPRS
    const painRecords = outcomes
      .filter((o) => o.type === "vas" || o.type === "nprs")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latestPain = painRecords[0]?.value ?? null;

    // Latest ROM (first ROM label found)
    const romRecords = outcomes
      .filter((o) => o.type === "rom")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latestRom = romRecords[0] ?? null;

    // Overall improvement
    const labelGroups = new Map<string, typeof outcomes>();
    for (const o of outcomes) {
      const key = `${o.type}::${o.label}`;
      if (!labelGroups.has(key)) labelGroups.set(key, []);
      labelGroups.get(key)!.push(o);
    }
    let improvingCount = 0;
    let totalCount = 0;
    for (const [key, records] of labelGroups) {
      if (records.length < 2) continue;
      const sorted = [...records].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const type = key.split("::")[0];
      const def = outcomeDefinitions.find((d) => d.type === type);
      const lowerIsBetter = def?.lowerIsBetter ?? false;
      const initial = sorted[0].value;
      const latest = sorted[sorted.length - 1].value;
      const pct = lowerIsBetter
        ? ((initial - latest) / Math.max(initial, 1)) * 100
        : ((latest - initial) / Math.max(initial, 1)) * 100;
      totalCount++;
      if (pct > 5) improvingCount++;
    }
    const overallImprovement = totalCount > 0 ? Math.round((improvingCount / totalCount) * 100) : null;

    return { latestPain, latestRom, overallImprovement };
  }, [outcomes]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Patient details */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <DetailRow
            icon={<Calendar className="size-4" />}
            label="Date of Birth"
            value={formatDate(patient.dateOfBirth)}
          />
          <DetailRow
            icon={<Phone className="size-4" />}
            label="Phone"
            value={patient.phone}
          />
          <DetailRow
            icon={<Mail className="size-4" />}
            label="Email"
            value={patient.email}
          />
          <DetailRow
            icon={<MapPin className="size-4" />}
            label="Address"
            value={patient.address}
          />
          {patient.insuranceProvider && (
            <DetailRow
              icon={<Shield className="size-4" />}
              label="Insurance"
              value={`${patient.insuranceProvider} (${patient.insuranceNumber ?? ""})`}
            />
          )}
          {patient.emergencyContact && (
            <DetailRow
              icon={<Phone className="size-4" />}
              label="Emergency"
              value={`${patient.emergencyContact} - ${patient.emergencyPhone ?? ""}`}
            />
          )}
        </CardContent>
      </Card>

      {/* Condition & outcome summary */}
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Condition</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{patient.condition}</p>
            {patient.notes && (
              <p className="mt-2 text-xs text-muted-foreground">
                {patient.notes}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Outcome Summary Card */}
        {outcomeSummary ? (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-primary" />
                <CardTitle>Progress Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {outcomeSummary.latestPain !== null && (
                  <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
                    <span className="text-xs text-muted-foreground">Latest Pain</span>
                    <span className={`text-2xl font-bold ${outcomeSummary.latestPain <= 3 ? "text-green-600" : outcomeSummary.latestPain <= 5 ? "text-amber-600" : "text-red-600"}`}>
                      {outcomeSummary.latestPain}/10
                    </span>
                  </div>
                )}
                {outcomeSummary.latestRom && (
                  <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
                    <span className="text-xs text-muted-foreground">Latest ROM</span>
                    <span className="text-2xl font-bold text-primary">
                      {outcomeSummary.latestRom.value}&deg;
                    </span>
                    <span className="text-[10px] text-muted-foreground">{outcomeSummary.latestRom.label}</span>
                  </div>
                )}
                {outcomeSummary.overallImprovement !== null && (
                  <div className="flex flex-col items-center gap-1 rounded-lg border p-3">
                    <span className="text-xs text-muted-foreground">Improving</span>
                    <span className="flex items-center gap-1 text-2xl font-bold text-green-600">
                      <TrendingUp className="size-5" />
                      {outcomeSummary.overallImprovement}%
                    </span>
                    <span className="text-[10px] text-muted-foreground">of measures</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Completion Rate</CardTitle>
              <CardDescription>{patient.completionRate}% overall</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${patient.completionRate}%` }}
                  />
                </div>
                <span className="text-sm font-medium">{patient.completionRate}%</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Discharge Readiness */}
        <DischargeReadinessCard patientId={patient.id} />
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm">{value}</span>
      </div>
    </div>
  );
}

// ---------- COMPARE DIALOG ----------
function NoteCompareDialog({
  open,
  onOpenChange,
  currentNote,
  previousNote,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentNote: SOAPNote | null;
  previousNote: SOAPNote | null;
}) {
  if (!currentNote || !previousNote) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Notes</DialogTitle>
          <DialogDescription>
            Side-by-side comparison of notes from {formatDate(previousNote.date)}{" "}
            and {formatDate(currentNote.date)}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {/* Previous note */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Previous</Badge>
              <span className="text-sm font-medium">
                {formatDate(previousNote.date)}
              </span>
            </div>
            <CompareSection label="Subjective" text={previousNote.subjective} />
            <CompareSection label="Objective" text={previousNote.objective} />
            <CompareSection label="Assessment" text={previousNote.assessment} />
            <CompareSection label="Plan" text={previousNote.plan} />
          </div>
          {/* Current note */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="default">Current</Badge>
              <span className="text-sm font-medium">
                {formatDate(currentNote.date)}
              </span>
            </div>
            <CompareSection label="Subjective" text={currentNote.subjective} />
            <CompareSection label="Objective" text={currentNote.objective} />
            <CompareSection label="Assessment" text={currentNote.assessment} />
            <CompareSection label="Plan" text={currentNote.plan} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CompareSection({ label, text }: { label: string; text: string }) {
  const colorMap: Record<string, string> = {
    Subjective: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    Objective: "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
    Assessment:
      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    Plan: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  };

  return (
    <div className="rounded-lg border p-3">
      <span
        className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${colorMap[label] ?? ""}`}
      >
        {label}
      </span>
      <p className="mt-1 text-sm whitespace-pre-wrap">{text}</p>
    </div>
  );
}

// ---------- NOTES TAB ----------
function NotesTab({ patient }: { patient: Patient }) {
  const { data: notes = [] } = useNotesByPatient(patient.id);

  const [compareOpen, setCompareOpen] = useState(false);
  const [compareNoteIndex, setCompareNoteIndex] = useState<number | null>(null);

  // Sort notes by date descending for display, keep original order for comparison
  const sortedNotes = useMemo(
    () =>
      [...notes].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [notes]
  );

  function handleCompare(index: number) {
    setCompareNoteIndex(index);
    setCompareOpen(true);
  }

  // Get the most recent note's objective for "Copy from Last Note"
  const lastNote = sortedNotes.length > 0 ? sortedNotes[0] : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">SOAP Notes ({notes.length})</h3>
        <div className="flex items-center gap-2">
          {lastNote && (
            <Link
              href={`/patients/${patient.id}/notes/new?copyObjective=${encodeURIComponent(lastNote.objective)}`}
            >
              <Button size="sm" variant="outline">
                <Copy className="size-3.5" />
                Copy from Last Note
              </Button>
            </Link>
          )}
          <Link href={`/patients/${patient.id}/notes/new`}>
            <Button size="sm">
              <Plus className="size-3.5" />
              New Note
            </Button>
          </Link>
        </div>
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No notes yet. Create the first SOAP note for this patient.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {sortedNotes.map((note, index) => (
            <Card key={note.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    <CardTitle>{formatDate(note.date)}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {index < sortedNotes.length - 1 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCompare(index)}
                        className="gap-1"
                      >
                        <GitCompareArrows className="size-3.5" />
                        Compare
                      </Button>
                    )}
                    {note.signed && <Badge variant="default">Signed</Badge>}
                    <span className="text-xs text-muted-foreground">
                      {note.therapistName}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <NoteSection label="Subjective" text={note.subjective} />
                  <NoteSection label="Objective" text={note.objective} />
                  <NoteSection label="Assessment" text={note.assessment} />
                  <NoteSection label="Plan" text={note.plan} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Compare dialog */}
      {compareNoteIndex !== null && compareNoteIndex < sortedNotes.length - 1 && (
        <NoteCompareDialog
          open={compareOpen}
          onOpenChange={setCompareOpen}
          currentNote={sortedNotes[compareNoteIndex]}
          previousNote={sortedNotes[compareNoteIndex + 1]}
        />
      )}
    </div>
  );
}

function NoteSection({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <span className="text-xs font-medium text-muted-foreground uppercase">
        {label}
      </span>
      <p className="mt-0.5 text-sm line-clamp-3">{text}</p>
    </div>
  );
}

// ---------- PLANS TAB ----------
function PlansTab({ patient }: { patient: Patient }) {
  const { data: plans = [] } = usePlansByPatient(patient.id);

  const planStatusVariant: Record<
    string,
    "default" | "secondary" | "outline"
  > = {
    draft: "outline",
    active: "default",
    completed: "secondary",
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Treatment Plans ({plans.length})
        </h3>
        <Link href={`/patients/${patient.id}/plans/new`}>
          <Button size="sm">
            <Plus className="size-3.5" />
            New Plan
          </Button>
        </Link>
      </div>

      {plans.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No treatment plans yet. Create a plan for this patient.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-0.5">
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.condition}</CardDescription>
                  </div>
                  <Badge
                    variant={planStatusVariant[plan.status] ?? "outline"}
                  >
                    {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Goals
                  </span>
                  <ul className="list-disc pl-4 text-sm">
                    {plan.goals.map((goal, i) => (
                      <li key={i}>{goal}</li>
                    ))}
                  </ul>
                  <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      {plan.phases.length} phase
                      {plan.phases.length !== 1 ? "s" : ""}
                    </span>
                    <span>Updated {formatDate(plan.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- APPOINTMENTS TAB ----------
function AppointmentsTab({ patient }: { patient: Patient }) {
  const { data: appointments = [] } = useAppointmentsByPatient(patient.id);

  const sorted = useMemo(() => [...appointments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  ), [appointments]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Appointments ({sorted.length})
        </h3>
      </div>

      {sorted.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No appointments found for this patient.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((appt) => (
            <Card key={appt.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <CardTitle>{formatDate(appt.date)}</CardTitle>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(appt.startTime)} -{" "}
                      {formatTime(appt.endTime)}
                    </span>
                  </div>
                  <Badge
                    variant={
                      appointmentStatusVariant[appt.status] ?? "outline"
                    }
                  >
                    {appt.status.charAt(0).toUpperCase() +
                      appt.status.slice(1).replace("-", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm">
                  <span>
                    {appointmentTypeLabel[appt.type] ?? appt.type}
                  </span>
                  {appt.location && (
                    <span className="text-xs text-muted-foreground">
                      {appt.location}
                    </span>
                  )}
                </div>
                {appt.notes && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {appt.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- MESSAGES TAB ----------
function MessagesTab({ patient }: { patient: Patient }) {
  const { data: conversations = [] } = useConversations();
  const conversation = conversations.find(
    (c) => c.patientId === patient.id
  );

  const recentMessages = conversation
    ? [...conversation.messages].slice(-5).reverse()
    : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Messages{" "}
          {conversation ? `(${conversation.messages.length})` : ""}
        </h3>
        {conversation && (
          <Link href={`/messages/${conversation.id}`}>
            <Button size="sm" variant="outline">
              <MessageSquare className="size-3.5" />
              Full Conversation
            </Button>
          </Link>
        )}
      </div>

      {!conversation || recentMessages.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No messages with this patient yet.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {recentMessages.map((msg) => (
            <Card key={msg.id}>
              <CardContent className="flex items-start gap-3 py-3">
                <div
                  className={`mt-0.5 size-2 shrink-0 rounded-full ${
                    msg.senderRole === "therapist"
                      ? "bg-primary"
                      : "bg-muted-foreground"
                  }`}
                />
                <div className="flex flex-1 flex-col gap-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">
                      {msg.senderName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- PROGRESS TAB ----------
function ProgressTab({ patient }: { patient: Patient }) {
  return (
    <div className="flex flex-col gap-6">
      <ProgressCharts patientId={patient.id} />
      <AIProgressSummary patientId={patient.id} />
      <ProgressReport patientId={patient.id} />
    </div>
  );
}

// ---------- PROFILE TABS ----------
export function ProfileTabs({ patient }: { patient: Patient }) {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="progress">Progress</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="plans">Plans</TabsTrigger>
        <TabsTrigger value="appointments">Appointments</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab patient={patient} />
      </TabsContent>
      <TabsContent value="progress">
        <ProgressTab patient={patient} />
      </TabsContent>
      <TabsContent value="notes">
        <NotesTab patient={patient} />
      </TabsContent>
      <TabsContent value="plans">
        <PlansTab patient={patient} />
      </TabsContent>
      <TabsContent value="appointments">
        <AppointmentsTab patient={patient} />
      </TabsContent>
      <TabsContent value="messages">
        <MessagesTab patient={patient} />
      </TabsContent>
    </Tabs>
  );
}
