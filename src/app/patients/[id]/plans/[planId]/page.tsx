"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgrammeBuilder } from "@/components/exercises/programme-builder";
import { usePatient } from "@/hooks/use-patients";
import { usePlan, useCreatePlan, useUpdatePlan } from "@/hooks/use-plans";
import type { TreatmentPlan } from "@/types";

export default function PlanBuilderPage({
  params,
}: {
  params: Promise<{ id: string; planId: string }>;
}) {
  const { id: patientId, planId } = use(params);
  const router = useRouter();
  const isNew = planId === "new";
  const { data: patient, isLoading: patientLoading } = usePatient(patientId);
  const { data: existingPlan, isLoading: planLoading } = usePlan(isNew ? "" : planId);
  const createPlan = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();

  const defaultPlan: TreatmentPlan = existingPlan || {
    id: `plan-${Date.now()}`,
    patientId,
    name: "",
    condition: patient?.condition || "",
    goals: [],
    phases: [],
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleSave = (plan: TreatmentPlan) => {
    if (isNew) {
      createPlan.mutate(plan, {
        onSuccess: () => router.push(`/patients/${patientId}`),
      });
    } else {
      updatePlanMutation.mutate({ id: plan.id, data: plan }, {
        onSuccess: () => router.push(`/patients/${patientId}`),
      });
    }
  };

  if (patientLoading || (!isNew && planLoading)) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.push(`/patients/${patientId}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950">
            <ClipboardList className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {isNew ? "New Treatment Plan" : existingPlan?.name || "Edit Plan"}
            </h1>
            {patient && (
              <p className="text-sm text-muted-foreground">
                {patient.firstName} {patient.lastName}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Builder */}
      <ProgrammeBuilder
        plan={defaultPlan}
        onSave={handleSave}
        patientName={patient ? `${patient.firstName} ${patient.lastName}` : undefined}
      />
    </div>
  );
}
