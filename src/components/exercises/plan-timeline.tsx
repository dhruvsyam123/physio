"use client";

import type { TreatmentPhase } from "@/types";

interface PlanTimelineProps {
  phases: TreatmentPhase[];
  onPhaseClick?: (phaseId: string) => void;
}

const phaseColors = [
  {
    bg: "bg-teal-200 dark:bg-teal-800",
    hover: "hover:bg-teal-300 dark:hover:bg-teal-700",
    text: "text-teal-900 dark:text-teal-100",
    label: "text-teal-700 dark:text-teal-300",
  },
  {
    bg: "bg-violet-200 dark:bg-violet-800",
    hover: "hover:bg-violet-300 dark:hover:bg-violet-700",
    text: "text-violet-900 dark:text-violet-100",
    label: "text-violet-700 dark:text-violet-300",
  },
  {
    bg: "bg-emerald-200 dark:bg-emerald-800",
    hover: "hover:bg-emerald-300 dark:hover:bg-emerald-700",
    text: "text-emerald-900 dark:text-emerald-100",
    label: "text-emerald-700 dark:text-emerald-300",
  },
  {
    bg: "bg-amber-200 dark:bg-amber-800",
    hover: "hover:bg-amber-300 dark:hover:bg-amber-700",
    text: "text-amber-900 dark:text-amber-100",
    label: "text-amber-700 dark:text-amber-300",
  },
];

export function PlanTimeline({ phases, onPhaseClick }: PlanTimelineProps) {
  if (phases.length === 0) return null;

  const minWeek = Math.min(...phases.map((p) => p.weekStart));
  const maxWeek = Math.max(...phases.map((p) => p.weekEnd));
  const totalWeeks = maxWeek - minWeek + 1;

  // Generate week labels
  const weekLabels: number[] = [];
  for (let w = minWeek; w <= maxWeek; w++) {
    weekLabels.push(w);
  }

  return (
    <div className="space-y-1.5">
      {/* Phase name labels */}
      <div className="relative flex" style={{ height: 20 }}>
        {phases.map((phase, idx) => {
          const width = ((phase.weekEnd - phase.weekStart + 1) / totalWeeks) * 100;
          const left = ((phase.weekStart - minWeek) / totalWeeks) * 100;
          const color = phaseColors[idx % phaseColors.length];
          return (
            <div
              key={phase.id}
              className={`absolute truncate text-[10px] font-medium ${color.label}`}
              style={{ left: `${left}%`, width: `${width}%` }}
              title={phase.name}
            >
              {phase.name}
            </div>
          );
        })}
      </div>

      {/* Colored bar segments */}
      <div className="relative flex h-9 w-full overflow-hidden rounded-lg border">
        {phases.map((phase, idx) => {
          const width = ((phase.weekEnd - phase.weekStart + 1) / totalWeeks) * 100;
          const color = phaseColors[idx % phaseColors.length];
          return (
            <button
              key={phase.id}
              type="button"
              className={`relative flex items-center justify-center transition-colors ${color.bg} ${color.hover} ${color.text}`}
              style={{ width: `${width}%` }}
              onClick={() => onPhaseClick?.(phase.id)}
              title={`${phase.name} - ${phase.exercises.length} exercises`}
            >
              <span className="text-[10px] font-semibold">
                {phase.exercises.length} exercise{phase.exercises.length !== 1 ? "s" : ""}
              </span>
            </button>
          );
        })}
      </div>

      {/* Week labels */}
      <div className="relative flex" style={{ height: 16 }}>
        {weekLabels.map((w) => {
          const left = ((w - minWeek) / totalWeeks) * 100;
          const width = (1 / totalWeeks) * 100;
          return (
            <div
              key={w}
              className="absolute text-center text-[9px] text-muted-foreground"
              style={{ left: `${left}%`, width: `${width}%` }}
            >
              Wk {w}
            </div>
          );
        })}
      </div>
    </div>
  );
}
