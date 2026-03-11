"use client";

import {
  Dumbbell,
  Activity,
  StretchHorizontal,
  Move,
  Scale,
  Heart,
  Zap,
  Target,
  Lightbulb,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { Exercise } from "@/types";

const regionIcons: Record<string, React.ReactNode> = {
  neck: <Activity className="h-10 w-10" />,
  shoulder: <StretchHorizontal className="h-10 w-10" />,
  "upper-back": <Activity className="h-10 w-10" />,
  "lower-back": <Activity className="h-10 w-10" />,
  hip: <Move className="h-10 w-10" />,
  knee: <Zap className="h-10 w-10" />,
  ankle: <Zap className="h-10 w-10" />,
  wrist: <StretchHorizontal className="h-10 w-10" />,
  elbow: <StretchHorizontal className="h-10 w-10" />,
  core: <Scale className="h-10 w-10" />,
  "full-body": <Heart className="h-10 w-10" />,
};

const regionGradients: Record<string, string> = {
  neck: "from-violet-100 to-violet-50 dark:from-violet-950 dark:to-violet-900",
  shoulder: "from-blue-100 to-blue-50 dark:from-blue-950 dark:to-blue-900",
  "upper-back":
    "from-indigo-100 to-indigo-50 dark:from-indigo-950 dark:to-indigo-900",
  "lower-back":
    "from-purple-100 to-purple-50 dark:from-purple-950 dark:to-purple-900",
  hip: "from-rose-100 to-rose-50 dark:from-rose-950 dark:to-rose-900",
  knee: "from-amber-100 to-amber-50 dark:from-amber-950 dark:to-amber-900",
  ankle: "from-orange-100 to-orange-50 dark:from-orange-950 dark:to-orange-900",
  wrist: "from-cyan-100 to-cyan-50 dark:from-cyan-950 dark:to-cyan-900",
  elbow: "from-teal-100 to-teal-50 dark:from-teal-950 dark:to-teal-900",
  core: "from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-emerald-900",
  "full-body": "from-pink-100 to-pink-50 dark:from-pink-950 dark:to-pink-900",
};

const difficultyColors: Record<string, string> = {
  beginner:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  intermediate:
    "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const categoryColors: Record<string, string> = {
  strengthening:
    "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  stretching:
    "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  mobility: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  balance:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  cardio: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  functional:
    "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
};

interface ExerciseDetailDialogProps {
  exercise: Exercise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExerciseDetailDialog({
  exercise,
  open,
  onOpenChange,
}: ExerciseDetailDialogProps) {
  if (!exercise) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        {/* Hero header */}
        <div
          className={`-mx-4 -mt-4 flex items-center justify-center rounded-t-xl bg-gradient-to-br p-8 ${
            regionGradients[exercise.bodyRegion] ||
            regionGradients["full-body"]
          }`}
        >
          <div className="text-muted-foreground/60">
            {regionIcons[exercise.bodyRegion] || (
              <Dumbbell className="h-10 w-10" />
            )}
          </div>
        </div>

        <DialogHeader>
          <DialogTitle className="text-lg">{exercise.name}</DialogTitle>
          <DialogDescription>{exercise.description}</DialogDescription>
        </DialogHeader>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <span
            className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium ${
              categoryColors[exercise.category]
            }`}
          >
            {exercise.category}
          </span>
          <span
            className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium ${
              difficultyColors[exercise.difficulty]
            }`}
          >
            {exercise.difficulty}
          </span>
          <Badge variant="secondary" className="text-xs">
            {exercise.bodyRegion.replace("-", " ")}
          </Badge>
        </div>

        {/* Prescription info */}
        <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-3">
          {exercise.sets && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                <span className="font-medium">{exercise.sets}</span> sets
              </span>
            </div>
          )}
          {exercise.reps && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              <span>
                <span className="font-medium">{exercise.reps}</span> reps
              </span>
            </div>
          )}
          {exercise.holdSeconds && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                <span className="font-medium">{exercise.holdSeconds}s</span>{" "}
                hold
              </span>
            </div>
          )}
          {exercise.duration && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{exercise.duration}</span>
            </div>
          )}
          {exercise.equipment && (
            <div className="col-span-2 flex items-center gap-2 text-sm">
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
              <span>{exercise.equipment}</span>
            </div>
          )}
        </div>

        {/* Target muscles */}
        {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4 text-rose-500" />
              Target muscles
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {exercise.targetMuscles.map((muscle) => (
                <Badge key={muscle} variant="outline" className="text-xs font-normal">
                  {muscle}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Best for */}
        {exercise.bestFor && (
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Best used for
            </h4>
            <p className="text-sm text-muted-foreground">{exercise.bestFor}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Instructions</h4>
          <ol className="space-y-2 pl-5 text-sm text-muted-foreground">
            {exercise.instructions.map((step, i) => (
              <li key={i} className="list-decimal leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Tips */}
        {exercise.tips && exercise.tips.length > 0 && (
          <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900 dark:bg-amber-950/30">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-amber-800 dark:text-amber-300">
              <Lightbulb className="h-4 w-4" />
              Clinical tips
            </h4>
            <ul className="space-y-1.5 text-sm text-amber-900/80 dark:text-amber-200/80">
              {exercise.tips.map((tip, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
