"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  Trash2,
  GripVertical,
  Sparkles,
  Save,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  Undo2,
  Redo2,
  FileText,
  Activity,
  StretchHorizontal,
  Move,
  Zap,
  Scale,
  Heart,
  Dumbbell,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useExercises } from "@/hooks/use-exercises";
import { toast } from "sonner";
import { PlanTimeline } from "@/components/exercises/plan-timeline";
import { HEPPreview } from "@/components/exercises/hep-preview";
import type {
  TreatmentPlan,
  TreatmentPhase,
  PlanExercise,
  Exercise,
} from "@/types";

// ─── Category border colors ──────────────────────────────
const categoryBorderColors: Record<string, string> = {
  strengthening: "border-l-teal-500",
  stretching: "border-l-violet-500",
  mobility: "border-l-amber-500",
  balance: "border-l-emerald-500",
  cardio: "border-l-rose-500",
  functional: "border-l-blue-500",
};

// ─── Body region icons (small) ──────────────────────────
const regionIconsSmall: Record<string, React.ReactNode> = {
  neck: <Activity className="h-3 w-3" />,
  shoulder: <StretchHorizontal className="h-3 w-3" />,
  "upper-back": <Activity className="h-3 w-3" />,
  "lower-back": <Activity className="h-3 w-3" />,
  hip: <Move className="h-3 w-3" />,
  knee: <Zap className="h-3 w-3" />,
  ankle: <Zap className="h-3 w-3" />,
  wrist: <StretchHorizontal className="h-3 w-3" />,
  elbow: <StretchHorizontal className="h-3 w-3" />,
  core: <Scale className="h-3 w-3" />,
  "full-body": <Heart className="h-3 w-3" />,
};

// ─── Sortable Exercise Item ────────────────────────────
interface SortableExerciseProps {
  exercise: PlanExercise;
  onRemove: () => void;
  onUpdate: (updates: Partial<PlanExercise>) => void;
}

function SortableExercise({
  exercise,
  onRemove,
  onUpdate,
}: SortableExerciseProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: exercise.id });
  const [expanded, setExpanded] = useState(false);
  const { data: exercises = [] } = useExercises();
  const exerciseDetails = exercises.find((e) => e.id === exercise.exerciseId);
  const category = exerciseDetails?.category || "strengthening";
  const bodyRegion = exerciseDetails?.bodyRegion || "full-body";
  const borderColor = categoryBorderColors[category] || "border-l-gray-300";
  const regionIcon = regionIconsSmall[bodyRegion] || <Dumbbell className="h-3 w-3" />;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start gap-2 rounded-lg border border-l-4 bg-background p-3 ${borderColor} ${
        isDragging ? "shadow-lg rotate-1 scale-[1.02]" : ""
      }`}
    >
      <button
        className="mt-1 cursor-grab text-muted-foreground hover:text-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">{regionIcon}</span>
            <p className="text-sm font-medium">{exercise.exerciseName}</p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setExpanded(!expanded)}
              title={expanded ? "Collapse" : "Expand instructions"}
            >
              {expanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
            <Button variant="ghost" size="icon-xs" onClick={onRemove}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div>
            <Label className="text-[10px] text-muted-foreground">Sets</Label>
            <Input
              type="number"
              min={1}
              value={exercise.sets}
              onChange={(e) =>
                onUpdate({ sets: Number(e.target.value) || 1 })
              }
              className="h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">Reps</Label>
            <Input
              type="number"
              min={1}
              value={exercise.reps}
              onChange={(e) =>
                onUpdate({ reps: Number(e.target.value) || 1 })
              }
              className="h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Hold (s)
            </Label>
            <Input
              type="number"
              min={0}
              value={exercise.holdSeconds || 0}
              onChange={(e) =>
                onUpdate({
                  holdSeconds: Number(e.target.value) || undefined,
                })
              }
              className="h-7 text-xs"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">
              Frequency
            </Label>
            <Input
              value={exercise.frequency}
              onChange={(e) => onUpdate({ frequency: e.target.value })}
              className="h-7 text-xs"
              placeholder="e.g. Daily"
            />
          </div>
        </div>

        <div>
          <Label className="text-[10px] text-muted-foreground">Notes</Label>
          <Input
            value={exercise.notes || ""}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            className="h-7 text-xs"
            placeholder="Exercise-specific notes..."
          />
        </div>

        {/* Expandable instructions */}
        {expanded && exerciseDetails?.instructions && (
          <div className="space-y-1.5 border-t pt-2">
            <p className="text-[10px] font-medium text-muted-foreground">
              Instructions:
            </p>
            <ol className="space-y-1 pl-4 text-[11px] text-muted-foreground">
              {exerciseDetails.instructions.map((step, i) => (
                <li key={i} className="list-decimal">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Drag overlay card (floating preview) ───────────────
function DragOverlayCard({ exercise }: { exercise: PlanExercise }) {
  const { data: exercises = [] } = useExercises();
  const details = exercises.find((e) => e.id === exercise.exerciseId);
  const category = details?.category || "strengthening";
  const borderColor = categoryBorderColors[category] || "border-l-gray-300";

  return (
    <div
      className={`flex items-start gap-2 rounded-lg border border-l-4 bg-background p-3 shadow-lg rotate-2 scale-[1.04] ${borderColor}`}
    >
      <GripVertical className="mt-1 h-4 w-4 text-muted-foreground" />
      <div className="flex-1">
        <p className="text-sm font-medium">{exercise.exerciseName}</p>
        <p className="text-[10px] text-muted-foreground">
          {exercise.sets} x {exercise.reps}
          {exercise.holdSeconds ? ` | ${exercise.holdSeconds}s hold` : ""}
        </p>
      </div>
    </div>
  );
}

// ─── Exercise Command Palette ───────────────────────────
interface ExerciseCommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (exercise: Exercise) => void;
  condition?: string;
}

function ExerciseCommandPalette({
  open,
  onOpenChange,
  onAdd,
  condition,
}: ExerciseCommandPaletteProps) {
  const { data: exercises = [] } = useExercises();

  // Group by body region
  const grouped = exercises.reduce<Record<string, Exercise[]>>((acc, ex) => {
    const region = ex.bodyRegion;
    if (!acc[region]) acc[region] = [];
    acc[region].push(ex);
    return acc;
  }, {});

  // Generate AI recommendations based on condition
  const getAIRecommendations = (): Exercise[] => {
    if (!condition) return [];
    const lower = condition.toLowerCase();
    let recommended: Exercise[] = [];

    if (lower.includes("knee") || lower.includes("acl")) {
      recommended = exercises.filter((e) =>
        ["ex1", "ex2", "ex3", "ex4"].includes(e.id)
      );
    } else if (lower.includes("shoulder") || lower.includes("rotator")) {
      recommended = exercises.filter((e) =>
        ["ex8", "ex9", "ex10", "ex13"].includes(e.id)
      );
    } else if (
      lower.includes("back") ||
      lower.includes("lumbar") ||
      lower.includes("disc")
    ) {
      recommended = exercises.filter((e) =>
        ["ex15", "ex16", "ex17", "ex20"].includes(e.id)
      );
    } else if (lower.includes("hip") || lower.includes("replacement")) {
      recommended = exercises.filter((e) =>
        ["ex22", "ex23", "ex25", "ex26"].includes(e.id)
      );
    } else if (lower.includes("elbow") || lower.includes("epicondyl")) {
      recommended = exercises.filter((e) =>
        ["ex39", "ex40", "ex41", "ex44"].includes(e.id)
      );
    } else if (lower.includes("ankle")) {
      recommended = exercises.filter((e) =>
        ["ex27", "ex28", "ex30", "ex31"].includes(e.id)
      );
    } else {
      // Default recommendations
      recommended = exercises.filter((e) =>
        ["ex45", "ex17", "ex20", "ex49"].includes(e.id)
      );
    }

    return recommended.slice(0, 4);
  };

  const aiRecommendations = getAIRecommendations();

  const difficultyBadgeColors: Record<string, string> = {
    beginner:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    intermediate:
      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    advanced:
      "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  const categoryBadgeColors: Record<string, string> = {
    strengthening:
      "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
    stretching:
      "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
    mobility:
      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    balance:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    cardio:
      "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
    functional:
      "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Add Exercise"
      description="Search exercises or pick from AI recommendations"
    >
      <Command>
        <CommandInput placeholder="Search exercises..." />
        <CommandList className="max-h-80">
          <CommandEmpty>No exercises found.</CommandEmpty>

          {/* AI Recommendations */}
          {aiRecommendations.length > 0 && (
            <CommandGroup heading="AI Recommended">
              {aiRecommendations.map((ex) => (
                <CommandItem
                  key={`ai-${ex.id}`}
                  value={`ai-recommend-${ex.name}`}
                  onSelect={() => {
                    onAdd(ex);
                    onOpenChange(false);
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span className="flex-1 truncate text-sm">{ex.name}</span>
                  <span
                    className={`inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-medium ${
                      difficultyBadgeColors[ex.difficulty] || ""
                    }`}
                  >
                    {ex.difficulty}
                  </span>
                  <span
                    className={`inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-medium ${
                      categoryBadgeColors[ex.category] || ""
                    }`}
                  >
                    {ex.category}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* Grouped by body region */}
          {Object.entries(grouped).map(([region, regionExercises]) => (
            <CommandGroup
              key={region}
              heading={region.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            >
              {regionExercises.map((ex) => (
                <CommandItem
                  key={ex.id}
                  value={`${ex.name} ${ex.bodyRegion} ${ex.category} ${ex.difficulty}`}
                  onSelect={() => {
                    onAdd(ex);
                    onOpenChange(false);
                  }}
                >
                  <span className="flex-1 truncate text-sm">{ex.name}</span>
                  <span
                    className={`inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-medium ${
                      difficultyBadgeColors[ex.difficulty] || ""
                    }`}
                  >
                    {ex.difficulty}
                  </span>
                  <span
                    className={`inline-flex h-4 items-center rounded-full px-1.5 text-[9px] font-medium ${
                      categoryBadgeColors[ex.category] || ""
                    }`}
                  >
                    {ex.category}
                  </span>
                  {ex.equipment && (
                    <Badge variant="secondary" className="text-[9px] h-4">
                      {ex.equipment}
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

// ─── Phase Editor ──────────────────────────────────────
interface PhaseEditorProps {
  phase: TreatmentPhase;
  onUpdate: (updates: Partial<TreatmentPhase>) => void;
  onRemove: () => void;
  onExercisesChange: (exercises: PlanExercise[]) => void;
  onOpenCommandPalette: () => void;
}

function PhaseEditor({
  phase,
  onUpdate,
  onRemove,
  onExercisesChange,
  onOpenCommandPalette,
}: PhaseEditorProps) {
  const handleRemoveExercise = (exerciseId: string) => {
    onExercisesChange(phase.exercises.filter((e) => e.id !== exerciseId));
  };

  const handleUpdateExercise = (
    exerciseId: string,
    updates: Partial<PlanExercise>
  ) => {
    onExercisesChange(
      phase.exercises.map((e) =>
        e.id === exerciseId ? { ...e, ...updates } : e
      )
    );
  };

  return (
    <Card data-phase-id={phase.id}>
      <CardContent className="space-y-4">
        {/* Phase Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <Input
              value={phase.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="h-8 text-sm font-semibold"
              placeholder="Phase name"
            />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Label className="text-xs text-muted-foreground">Weeks</Label>
                <Input
                  type="number"
                  min={1}
                  value={phase.weekStart}
                  onChange={(e) =>
                    onUpdate({ weekStart: Number(e.target.value) || 1 })
                  }
                  className="h-7 w-16 text-xs"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <Input
                  type="number"
                  min={phase.weekStart}
                  value={phase.weekEnd}
                  onChange={(e) =>
                    onUpdate({
                      weekEnd: Number(e.target.value) || phase.weekStart,
                    })
                  }
                  className="h-7 w-16 text-xs"
                />
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onRemove}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>

        {/* Phase Notes */}
        <div>
          <Label className="text-xs text-muted-foreground">Phase Notes</Label>
          <Textarea
            value={phase.notes || ""}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Notes for this phase..."
            className="min-h-12 text-xs"
          />
        </div>

        {/* Exercises */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Exercises ({phase.exercises.length})
          </p>

          <SortableContext
            items={phase.exercises.map((e) => e.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2" data-phase-id={phase.id}>
              {phase.exercises.map((ex) => (
                <SortableExercise
                  key={ex.id}
                  exercise={ex}
                  onRemove={() => handleRemoveExercise(ex.id)}
                  onUpdate={(updates) => handleUpdateExercise(ex.id, updates)}
                />
              ))}
            </div>
          </SortableContext>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onOpenCommandPalette}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Exercise
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Programme Builder ─────────────────────────────────
interface ProgrammeBuilderProps {
  plan: TreatmentPlan;
  onSave: (plan: TreatmentPlan) => void;
  patientName?: string;
}

export function ProgrammeBuilder({
  plan: initialPlan,
  onSave,
  patientName,
}: ProgrammeBuilderProps) {
  const [plan, setPlan] = useState<TreatmentPlan>(initialPlan);
  const [generating, setGenerating] = useState(false);
  const [activeDragId, setActiveDragId] = useState<UniqueIdentifier | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [activePhaseId, setActivePhaseId] = useState<string | null>(null);
  const [hepPreviewOpen, setHepPreviewOpen] = useState(false);

  // ─── Undo/Redo system ──────────────────────────────────
  const [history, setHistory] = useState<string[]>([
    JSON.stringify(initialPlan.phases),
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUndoRedo = useRef(false);

  const pushHistory = useCallback((phases: TreatmentPhase[]) => {
    if (isUndoRedo.current) {
      isUndoRedo.current = false;
      return;
    }
    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(JSON.stringify(phases));
      // Keep last 50 snapshots
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex((prev) => {
      // Account for possible shift
      return Math.min(prev + 1, 49);
    });
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    isUndoRedo.current = true;
    setHistoryIndex(newIndex);
    const phases = JSON.parse(history[newIndex]) as TreatmentPhase[];
    setPlan((prev) => ({
      ...prev,
      phases,
      updatedAt: new Date().toISOString(),
    }));
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    isUndoRedo.current = true;
    setHistoryIndex(newIndex);
    const phases = JSON.parse(history[newIndex]) as TreatmentPhase[];
    setPlan((prev) => ({
      ...prev,
      phases,
      updatedAt: new Date().toISOString(),
    }));
  }, [historyIndex, history]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  // ─── DnD sensors ───────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const updatePlan = useCallback(
    (updates: Partial<TreatmentPlan>) => {
      setPlan((prev) => {
        const newPlan = {
          ...prev,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        if (updates.phases) {
          pushHistory(updates.phases);
        }
        return newPlan;
      });
    },
    [pushHistory]
  );

  // ─── Find which phase an exercise belongs to ──────────
  const findPhaseForExercise = useCallback(
    (exerciseId: UniqueIdentifier): TreatmentPhase | undefined => {
      return plan.phases.find((phase) =>
        phase.exercises.some((e) => e.id === exerciseId)
      );
    },
    [plan.phases]
  );

  // ─── DnD handlers ─────────────────────────────────────
  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    if (!over || active.id === over.id) return;

    const sourcePhase = findPhaseForExercise(active.id);
    const destPhase = findPhaseForExercise(over.id);

    if (!sourcePhase) return;

    if (sourcePhase && destPhase && sourcePhase.id === destPhase.id) {
      // Same phase reorder
      const oldIndex = sourcePhase.exercises.findIndex(
        (e) => e.id === active.id
      );
      const newIndex = sourcePhase.exercises.findIndex(
        (e) => e.id === over.id
      );
      if (oldIndex === -1 || newIndex === -1) return;

      const newExercises = arrayMove(
        sourcePhase.exercises,
        oldIndex,
        newIndex
      );
      updatePlan({
        phases: plan.phases.map((p) =>
          p.id === sourcePhase.id ? { ...p, exercises: newExercises } : p
        ),
      });
    } else if (sourcePhase && destPhase && sourcePhase.id !== destPhase.id) {
      // Cross-phase move
      const exerciseToMove = sourcePhase.exercises.find(
        (e) => e.id === active.id
      );
      if (!exerciseToMove) return;

      const destIndex = destPhase.exercises.findIndex(
        (e) => e.id === over.id
      );

      const newSourceExercises = sourcePhase.exercises.filter(
        (e) => e.id !== active.id
      );
      const newDestExercises = [...destPhase.exercises];
      const insertIndex = destIndex === -1 ? newDestExercises.length : destIndex;
      newDestExercises.splice(insertIndex, 0, exerciseToMove);

      updatePlan({
        phases: plan.phases.map((p) => {
          if (p.id === sourcePhase.id)
            return { ...p, exercises: newSourceExercises };
          if (p.id === destPhase.id)
            return { ...p, exercises: newDestExercises };
          return p;
        }),
      });
    }
  };

  // ─── Get the active dragging exercise for overlay ─────
  const activeDragExercise = activeDragId
    ? plan.phases
        .flatMap((p) => p.exercises)
        .find((e) => e.id === activeDragId)
    : null;

  // ─── Phase operations ──────────────────────────────────
  const addPhase = () => {
    const lastPhase = plan.phases[plan.phases.length - 1];
    const newPhase: TreatmentPhase = {
      id: `phase-${Date.now()}`,
      name: `Phase ${plan.phases.length + 1}`,
      weekStart: lastPhase ? lastPhase.weekEnd + 1 : 1,
      weekEnd: lastPhase ? lastPhase.weekEnd + 4 : 4,
      exercises: [],
    };
    updatePlan({ phases: [...plan.phases, newPhase] });
  };

  const removePhase = (phaseId: string) => {
    updatePlan({ phases: plan.phases.filter((p) => p.id !== phaseId) });
  };

  const updatePhase = (phaseId: string, updates: Partial<TreatmentPhase>) => {
    updatePlan({
      phases: plan.phases.map((p) =>
        p.id === phaseId ? { ...p, ...updates } : p
      ),
    });
  };

  const updatePhaseExercises = (
    phaseId: string,
    exercises: PlanExercise[]
  ) => {
    updatePlan({
      phases: plan.phases.map((p) =>
        p.id === phaseId ? { ...p, exercises } : p
      ),
    });
  };

  // ─── Add exercise via command palette ──────────────────
  const handleAddExerciseFromPalette = useCallback(
    (exercise: Exercise) => {
      const targetPhaseId =
        activePhaseId || plan.phases[plan.phases.length - 1]?.id;
      if (!targetPhaseId) return;

      const planExercise: PlanExercise = {
        id: `pe-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        sets: exercise.sets || 3,
        reps: exercise.reps || 10,
        holdSeconds: exercise.holdSeconds,
        frequency: "Daily",
      };

      updatePlan({
        phases: plan.phases.map((p) =>
          p.id === targetPhaseId
            ? { ...p, exercises: [...p.exercises, planExercise] }
            : p
        ),
      });
    },
    [activePhaseId, plan.phases, updatePlan]
  );

  const handleGenerateWithAI = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition: plan.condition,
          goals: plan.goals,
          patientId: plan.patientId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.phases) {
          updatePlan({ phases: data.phases });
        }
      }
    } catch {
      // Silently handle - AI generation is optional
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = () => {
    onSave(plan);
    toast.success("Treatment plan saved");
  };

  const handlePhaseClickFromTimeline = (phaseId: string) => {
    const el = document.querySelector(`[data-phase-id="${phaseId}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Plan Meta */}
      <Card>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs">Plan Name</Label>
              <Input
                value={plan.name}
                onChange={(e) => updatePlan({ name: e.target.value })}
                placeholder="Treatment plan name"
              />
            </div>
            <div>
              <Label className="text-xs">Condition</Label>
              <Input
                value={plan.condition}
                onChange={(e) => updatePlan({ condition: e.target.value })}
                placeholder="Primary condition"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Goals</Label>
            <Textarea
              value={plan.goals.join("\n")}
              onChange={(e) =>
                updatePlan({
                  goals: e.target.value.split("\n").filter((g) => g.trim()),
                })
              }
              placeholder="One goal per line..."
              className="min-h-20 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="outline"
          onClick={handleGenerateWithAI}
          disabled={generating || !plan.condition}
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {generating ? "Generating..." : "Generate with AI"}
        </Button>

        <Button
          variant="outline"
          onClick={() => setHepPreviewOpen(true)}
          disabled={plan.phases.flatMap((p) => p.exercises).length === 0}
        >
          <FileText className="h-4 w-4" />
          Generate HEP
        </Button>

        <div className="flex items-center gap-1 ml-auto">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Undo (Cmd+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Redo (Cmd+Shift+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Visual Timeline */}
      {plan.phases.length > 0 && (
        <PlanTimeline
          phases={plan.phases}
          onPhaseClick={handlePhaseClickFromTimeline}
        />
      )}

      {/* Phases with cross-phase DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              Phases ({plan.phases.length})
            </h3>
            <Button variant="outline" size="sm" onClick={addPhase}>
              <Plus className="h-3.5 w-3.5" />
              Add Phase
            </Button>
          </div>

          {plan.phases.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-12">
              <p className="text-sm text-muted-foreground">
                No phases yet. Add a phase or generate with AI.
              </p>
            </div>
          )}

          {plan.phases.map((phase) => (
            <PhaseEditor
              key={phase.id}
              phase={phase}
              onUpdate={(updates) => updatePhase(phase.id, updates)}
              onRemove={() => removePhase(phase.id)}
              onExercisesChange={(exercises) =>
                updatePhaseExercises(phase.id, exercises)
              }
              onOpenCommandPalette={() => {
                setActivePhaseId(phase.id);
                setCommandPaletteOpen(true);
              }}
            />
          ))}
        </div>

        <DragOverlay>
          {activeDragExercise ? (
            <DragOverlayCard exercise={activeDragExercise} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Exercise Command Palette */}
      <ExerciseCommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onAdd={handleAddExerciseFromPalette}
        condition={plan.condition}
      />

      {/* HEP Preview Dialog */}
      <Dialog open={hepPreviewOpen} onOpenChange={setHepPreviewOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Home Exercise Programme</DialogTitle>
            <DialogDescription>
              Preview and share the home exercise programme with your patient.
            </DialogDescription>
          </DialogHeader>
          <HEPPreview plan={plan} patientName={patientName} />
        </DialogContent>
      </Dialog>

      {/* Save */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4" />
          Save Plan
        </Button>
      </div>
    </div>
  );
}
