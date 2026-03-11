"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePatientStore } from "@/stores/patient-store";
import { IntakeForm } from "@/components/patients/intake-form";

export default function IntakePage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  const patient = usePatientStore((state) => state.getPatientById(patientId));

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href={`/patients/${patientId}`}>
          <Button variant="ghost" size="sm" className="gap-1.5 -ml-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Patient
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-lg bg-violet-100 p-2 dark:bg-violet-950">
            <ClipboardList className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Patient Intake Form
            </h1>
            {patient && (
              <p className="text-sm text-muted-foreground">
                {patient.firstName} {patient.lastName} &mdash;{" "}
                {patient.condition}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Intake Form */}
      <IntakeForm
        patientId={patientId}
        onSubmit={() => router.push(`/patients/${patientId}`)}
      />
    </div>
  );
}
