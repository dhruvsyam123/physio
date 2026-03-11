"use client";

import { useMemo, useState } from "react";
import { Dumbbell } from "lucide-react";
import { useExercises } from "@/hooks/use-exercises";
import { ExerciseFilters } from "@/components/exercises/exercise-filters";
import { ExerciseGrid } from "@/components/exercises/exercise-grid";
import { BodyMap } from "@/components/exercises/body-map";

export default function ExercisesPage() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  const { data: exercises = [], isLoading } = useExercises({
    region: region !== "all" ? region : undefined,
    category: category !== "all" ? category : undefined,
    difficulty: difficulty !== "all" ? difficulty : undefined,
    search: search || undefined,
  });

  // Also fetch all exercises for the body map counts
  const { data: allExercises = [] } = useExercises();

  const filtered = exercises;

  // Count exercises per body region (using all exercises, not filtered)
  const exerciseCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ex of allExercises) {
      counts[ex.bodyRegion] = (counts[ex.bodyRegion] || 0) + 1;
    }
    return counts;
  }, [allExercises]);

  const handleReset = () => {
    setSearch("");
    setRegion("all");
    setCategory("all");
    setDifficulty("all");
  };

  return (
    <div className="flex flex-col gap-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950">
          <Dumbbell className="h-5 w-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Exercise Library
          </h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} of {allExercises.length} exercises
          </p>
        </div>
      </div>

      {/* Main layout: Body map sidebar + content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Body Map Sidebar */}
        <div className="w-full lg:w-[280px] shrink-0">
          <BodyMap
            selectedRegion={region}
            onRegionChange={setRegion}
            exerciseCounts={exerciseCounts}
          />
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Other filters (search, category, difficulty) */}
          <ExerciseFilters
            search={search}
            onSearchChange={setSearch}
            region={region}
            onRegionChange={setRegion}
            category={category}
            onCategoryChange={setCategory}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            onReset={handleReset}
          />

          {/* Grid */}
          <ExerciseGrid exercises={filtered} />
        </div>
      </div>
    </div>
  );
}
