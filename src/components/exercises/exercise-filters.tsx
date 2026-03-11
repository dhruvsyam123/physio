"use client";

import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Exercise } from "@/types";

const categories: Exercise["category"][] = [
  "strengthening",
  "stretching",
  "mobility",
  "balance",
  "cardio",
  "functional",
];

const difficulties: Exercise["difficulty"][] = [
  "beginner",
  "intermediate",
  "advanced",
];

interface ExerciseFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  region: string;
  onRegionChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  difficulty: string;
  onDifficultyChange: (value: string) => void;
  onReset: () => void;
}

export function ExerciseFilters({
  search,
  onSearchChange,
  region,
  onRegionChange,
  category,
  onCategoryChange,
  difficulty,
  onDifficultyChange,
  onReset,
}: ExerciseFiltersProps) {
  const hasActiveFilters =
    search || region !== "all" || category !== "all" || difficulty !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Active region badge */}
      {region !== "all" && (
        <div className="flex items-center gap-1.5 rounded-full bg-teal-100 dark:bg-teal-900 px-3 py-1.5 text-xs font-medium text-teal-800 dark:text-teal-200">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
          {region.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          <button
            onClick={() => onRegionChange("all")}
            className="ml-1 hover:text-teal-600 dark:hover:text-teal-300"
          >
            ×
          </button>
        </div>
      )}

      {/* Category */}
      <Select value={category} onValueChange={(v) => onCategoryChange(v ?? "all")}>
        <SelectTrigger className="w-auto">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Difficulty */}
      <Select value={difficulty} onValueChange={(v) => onDifficultyChange(v ?? "all")}>
        <SelectTrigger className="w-auto">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          {difficulties.map((d) => (
            <SelectItem key={d} value={d}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>
      )}
    </div>
  );
}
