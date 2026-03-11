"use client";

import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, CalendarPlus, MessageSquare, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ProfileTabs } from "@/components/patients/profile-tabs";
import { usePatientStore } from "@/stores/patient-store";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  new: "secondary",
  "on-hold": "outline",
  discharged: "destructive",
};

const statusLabel: Record<string, string> = {
  active: "Active",
  new: "New",
  "on-hold": "On Hold",
  discharged: "Discharged",
};

export default function PatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const patient = usePatientStore((s) => s.getPatientById(id));

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <p className="text-sm text-muted-foreground">Patient not found.</p>
        <Button variant="outline" onClick={() => router.push("/patients")}>
          Back to Patients
        </Button>
      </div>
    );
  }

  const initials = `${patient.firstName[0]}${patient.lastName[0]}`;

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Back button */}
      <Link
        href="/patients"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="size-4" />
        Back to Patients
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar size="lg" className="size-14">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {patient.firstName} {patient.lastName}
              </h1>
              <Badge variant={statusVariant[patient.status]}>
                {statusLabel[patient.status]}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{patient.condition}</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          {patient.status === "new" && (
            <Link href={`/patients/${patient.id}/intake`}>
              <Button size="sm">
                <ClipboardList className="size-3.5" />
                Complete Intake
              </Button>
            </Link>
          )}
          <Link href={`/patients/${patient.id}/notes/new`}>
            <Button size="sm" variant="outline">
              <FileText className="size-3.5" />
              New Note
            </Button>
          </Link>
          <Link href={`/appointments/new?patientId=${patient.id}`}>
            <Button size="sm" variant="outline">
              <CalendarPlus className="size-3.5" />
              Schedule Appointment
            </Button>
          </Link>
          <Link href={`/messages?patientId=${patient.id}`}>
            <Button size="sm" variant="outline">
              <MessageSquare className="size-3.5" />
              Send Message
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Tabs */}
      <ProfileTabs patient={patient} />
    </div>
  );
}
