"use client";

import {
  Dumbbell,
  Printer,
  Send,
  Activity,
  StretchHorizontal,
  Move,
  Zap,
  Scale,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExercises } from "@/hooks/use-exercises";
import { toast } from "sonner";
import type { TreatmentPlan, TreatmentPhase } from "@/types";

const regionIcons: Record<string, React.ReactNode> = {
  neck: <Activity className="h-6 w-6" />,
  shoulder: <StretchHorizontal className="h-6 w-6" />,
  "upper-back": <Activity className="h-6 w-6" />,
  "lower-back": <Activity className="h-6 w-6" />,
  hip: <Move className="h-6 w-6" />,
  knee: <Zap className="h-6 w-6" />,
  ankle: <Zap className="h-6 w-6" />,
  wrist: <StretchHorizontal className="h-6 w-6" />,
  elbow: <StretchHorizontal className="h-6 w-6" />,
  core: <Scale className="h-6 w-6" />,
  "full-body": <Heart className="h-6 w-6" />,
};

const regionGradients: Record<string, string> = {
  neck: "from-violet-100 to-violet-50 dark:from-violet-950 dark:to-violet-900",
  shoulder: "from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900",
  "upper-back": "from-indigo-100 to-indigo-50 dark:from-indigo-950 dark:to-indigo-900",
  "lower-back": "from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900",
  hip: "from-rose-100 to-rose-50 dark:from-rose-950 dark:to-rose-900",
  knee: "from-amber-100 to-amber-50 dark:from-amber-950 dark:to-amber-900",
  ankle: "from-orange-100 to-orange-50 dark:from-orange-950 dark:to-orange-900",
  wrist: "from-cyan-100 to-cyan-50 dark:from-cyan-950 dark:to-cyan-900",
  elbow: "from-teal-100 to-teal-50 dark:from-teal-950 dark:to-teal-900",
  core: "from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-emerald-900",
  "full-body": "from-pink-100 to-pink-50 dark:from-pink-950 dark:to-pink-900",
};

interface HEPPreviewProps {
  plan: TreatmentPlan;
  patientName?: string;
}

export function HEPPreview({ plan, patientName }: HEPPreviewProps) {
  const { data: exercises = [] } = useExercises();

  const getExerciseDetails = (exerciseId: string) =>
    exercises.find((e) => e.id === exerciseId);

  const handlePrint = () => {
    window.print();
  };

  const handleSendToPatient = () => {
    toast.success("HEP sent to patient", {
      description: `The home exercise programme has been sent to ${patientName || "the patient"}.`,
    });
  };

  const allExercises = plan.phases.flatMap((phase) =>
    phase.exercises.map((pe) => ({ ...pe, phaseName: phase.name }))
  );

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Action buttons - hidden in print */}
      <div className="flex items-center justify-end gap-2 print:hidden">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="h-3.5 w-3.5" />
          Print
        </Button>
        <Button size="sm" onClick={handleSendToPatient}>
          <Send className="h-3.5 w-3.5" />
          Send to Patient
        </Button>
      </div>

      {/* HEP Content */}
      <div className="space-y-6 print:space-y-4">
        {/* Header */}
        <div className="space-y-1 border-b pb-4">
          <h2 className="text-lg font-bold">Home Exercise Programme</h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
            {patientName && <span>Patient: <strong className="text-foreground">{patientName}</strong></span>}
            <span>Plan: <strong className="text-foreground">{plan.name}</strong></span>
            <span>Date: <strong className="text-foreground">{today}</strong></span>
          </div>
          {plan.condition && (
            <p className="text-xs text-muted-foreground">
              Condition: {plan.condition}
            </p>
          )}
        </div>

        {/* Exercises by phase */}
        {plan.phases.map((phase: TreatmentPhase) => (
          <div key={phase.id} className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">{phase.name}</h3>
              <p className="text-xs text-muted-foreground">
                Weeks {phase.weekStart} - {phase.weekEnd}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 print:grid-cols-2">
              {phase.exercises.map((pe) => {
                const details = getExerciseDetails(pe.exerciseId);
                const bodyRegion = details?.bodyRegion || "full-body";
                const gradient = regionGradients[bodyRegion] || regionGradients["full-body"];
                const icon = regionIcons[bodyRegion] || <Dumbbell className="h-6 w-6" />;

                return (
                  <Card key={pe.id} className="overflow-hidden print:break-inside-avoid">
                    {/* Illustration placeholder */}
                    <div
                      className={`flex h-16 items-center justify-center bg-gradient-to-br ${gradient}`}
                    >
                      <div className="text-muted-foreground/50">{icon}</div>
                    </div>

                    <CardContent className="space-y-2 pt-2">
                      <h4 className="text-sm font-semibold">{pe.exerciseName}</h4>

                      {/* Prescription */}
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant="secondary" className="text-[10px]">
                          {pe.sets} x {pe.reps} reps
                        </Badge>
                        {pe.holdSeconds && pe.holdSeconds > 0 && (
                          <Badge variant="secondary" className="text-[10px]">
                            Hold {pe.holdSeconds}s
                          </Badge>
                        )}
                        <Badge variant="secondary" className="text-[10px]">
                          {pe.frequency}
                        </Badge>
                      </div>

                      {/* Instructions */}
                      {details?.instructions && details.instructions.length > 0 && (
                        <ol className="space-y-0.5 pl-4 text-[11px] text-muted-foreground">
                          {details.instructions.map((step, i) => (
                            <li key={i} className="list-decimal">
                              {step}
                            </li>
                          ))}
                        </ol>
                      )}

                      {pe.notes && (
                        <p className="text-[10px] italic text-muted-foreground">
                          Note: {pe.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        {/* Important Notes */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950 print:break-inside-avoid">
          <h3 className="mb-2 text-sm font-semibold text-amber-900 dark:text-amber-100">
            Important Notes
          </h3>
          <ul className="space-y-1 text-xs text-amber-800 dark:text-amber-200">
            <li>
              - Perform exercises as prescribed unless they cause sharp or increasing
              pain.
            </li>
            <li>
              - Some mild discomfort during exercises is normal, but pain should not
              exceed 4/10.
            </li>
            <li>
              - Stop exercising and contact your physiotherapist if you experience
              sudden sharp pain, significant swelling, or numbness/tingling.
            </li>
            <li>
              - Maintain good form throughout each exercise. Quality over quantity.
            </li>
            <li>
              - If you have any questions or concerns, contact your physiotherapy
              clinic.
            </li>
          </ul>
        </div>
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body > *:not(.hep-print-target) {
            /* Let normal print flow work */
          }
          nav,
          header,
          [data-slot="dialog-close"],
          .print\\:hidden {
            display: none !important;
          }
          @page {
            margin: 1.5cm;
          }
        }
      `}</style>
    </div>
  );
}
