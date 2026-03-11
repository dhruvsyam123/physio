"use client";

import { useState } from "react";
import {
  Dumbbell,
  Activity,
  StretchHorizontal,
  Move,
  Scale,
  Heart,
  Zap,
  Eye,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExerciseDetailDialog } from "./exercise-detail-dialog";
import type { Exercise } from "@/types";

const regionIcons: Record<string, React.ReactNode> = {
  neck: <Activity className="h-8 w-8" />,
  shoulder: <StretchHorizontal className="h-8 w-8" />,
  "upper-back": <Activity className="h-8 w-8" />,
  "lower-back": <Activity className="h-8 w-8" />,
  hip: <Move className="h-8 w-8" />,
  knee: <Zap className="h-8 w-8" />,
  ankle: <Zap className="h-8 w-8" />,
  wrist: <StretchHorizontal className="h-8 w-8" />,
  elbow: <StretchHorizontal className="h-8 w-8" />,
  core: <Scale className="h-8 w-8" />,
  "full-body": <Heart className="h-8 w-8" />,
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

const difficultyColors: Record<string, string> = {
  beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  advanced: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const categoryColors: Record<string, string> = {
  strengthening: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  stretching: "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  mobility: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  balance: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
  cardio: "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  functional: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
};

interface ExerciseCardProps {
  exercise: Exercise;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-md"
        onClick={() => setDetailOpen(true)}
      >
        {/* Placeholder image area */}
        <div
          className={`flex h-32 items-center justify-center rounded-t-lg bg-gradient-to-br ${
            regionGradients[exercise.bodyRegion] || regionGradients["full-body"]
          }`}
        >
          <div className="text-muted-foreground/60">
            {regionIcons[exercise.bodyRegion] || <Dumbbell className="h-8 w-8" />}
          </div>
        </div>

        <CardContent className="space-y-3 pt-3">
          {/* Name */}
          <h3 className="text-sm font-semibold leading-tight">{exercise.name}</h3>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5">
            <span
              className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-medium ${
                categoryColors[exercise.category]
              }`}
            >
              {exercise.category}
            </span>
            <span
              className={`inline-flex h-5 items-center rounded-full px-2 text-[10px] font-medium ${
                difficultyColors[exercise.difficulty]
              }`}
            >
              {exercise.difficulty}
            </span>
            <Badge variant="secondary" className="text-[10px]">
              {exercise.bodyRegion.replace("-", " ")}
            </Badge>
          </div>

          {/* Equipment */}
          {exercise.equipment && (
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Dumbbell className="h-3 w-3 shrink-0" />
              {exercise.equipment}
            </p>
          )}

          {/* Sets/reps summary */}
          <div className="flex gap-3 text-xs text-muted-foreground">
            {exercise.sets && <span>{exercise.sets} sets</span>}
            {exercise.reps && <span>{exercise.reps} reps</span>}
            {exercise.holdSeconds && <span>{exercise.holdSeconds}s hold</span>}
            {exercise.duration && <span>{exercise.duration}</span>}
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2">
            {exercise.description}
          </p>

          {/* View details button */}
          <Button
            variant="ghost"
            size="xs"
            className="w-full text-muted-foreground"
            onClick={(e) => {
              e.stopPropagation();
              setDetailOpen(true);
            }}
          >
            <Eye className="h-3 w-3" />
            View details
          </Button>
        </CardContent>
      </Card>

      <ExerciseDetailDialog
        exercise={exercise}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
