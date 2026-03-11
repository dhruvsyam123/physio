"use client";

import { useMemo, useState } from "react";
import { Dumbbell } from "lucide-react";
import { useExerciseStore } from "@/stores/exercise-store";
import { ExerciseFilters } from "@/components/exercises/exercise-filters";
import { ExerciseGrid } from "@/components/exercises/exercise-grid";

export default function ExercisesPage() {
  const exercises = useExerciseStore((s) => s.exercises);

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");
  const [category, setCategory] = useState("all");
  const [difficulty, setDifficulty] = useState("all");

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      if (region !== "all" && ex.bodyRegion !== region) return false;
      if (category !== "all" && ex.category !== category) return false;
      if (difficulty !== "all" && ex.difficulty !== difficulty) return false;
      if (search) {
        const q = search.toLowerCase();
        const match =
          ex.name.toLowerCase().includes(q) ||
          ex.description.toLowerCase().includes(q) ||
          ex.bodyRegion.toLowerCase().includes(q) ||
          ex.category.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [exercises, search, region, category, difficulty]);

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
            {filtered.length} of {exercises.length} exercises
          </p>
        </div>
      </div>

      {/* Filters */}
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
  );
}
