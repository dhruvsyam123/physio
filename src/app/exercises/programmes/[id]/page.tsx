"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgrammeBuilder } from "@/components/exercises/programme-builder";
import { usePlans, useCreatePlan, useUpdatePlan } from "@/hooks/use-plans";
import { usePatients } from "@/hooks/use-patients";
import type { TreatmentPlan } from "@/types";

export default function ProgrammeViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: plans = [] } = usePlans();
  const createPlan = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();
  const { data: patients = [] } = usePatients();

  const isNew = id === "new";
  const existingPlan = !isNew ? plans.find((p) => p.id === id) : undefined;
  const patient = existingPlan
    ? patients.find((p) => p.id === existingPlan.patientId)
    : undefined;

  const defaultPlan: TreatmentPlan = existingPlan || {
    id: `plan-${Date.now()}`,
    patientId: "",
    name: "",
    condition: "",
    goals: [],
    phases: [],
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleSave = (plan: TreatmentPlan) => {
    if (isNew || !existingPlan) {
      createPlan.mutate(plan, {
        onSuccess: () => router.push("/exercises"),
      });
    } else {
      updatePlanMutation.mutate(
        { id: plan.id, data: plan },
        { onSuccess: () => router.push("/exercises") }
      );
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.push("/exercises")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950">
            <ClipboardList className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {isNew
                ? "New Programme"
                : existingPlan?.name || "Programme Builder"}
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
      <ProgrammeBuilder plan={defaultPlan} onSave={handleSave} />
    </div>
  );
}
