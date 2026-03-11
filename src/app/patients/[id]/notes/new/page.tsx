"use client";

import { Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SOAPNoteEditor } from "@/components/notes/soap-note-editor";
import { usePatient } from "@/hooks/use-patients";

export default function NewSOAPNotePage() {
  return (
    <Suspense>
      <NewSOAPNotePageInner />
    </Suspense>
  );
}

function NewSOAPNotePageInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = params.id as string;
  const { data: patient, isLoading } = usePatient(patientId);

  const copyObjective = searchParams.get("copyObjective") ?? undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

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
          <div className="flex items-center justify-center rounded-lg bg-teal-100 p-2 dark:bg-teal-950">
            <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              New SOAP Note
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

      {/* SOAP Note Editor */}
      <SOAPNoteEditor
        patientId={patientId}
        onSaved={() => router.push(`/patients/${patientId}`)}
        initialObjective={copyObjective}
      />
    </div>
  );
}
