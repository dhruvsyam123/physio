import { create } from 'zustand';
import type { Exercise } from '@/types';
import { mockExercises } from '@/data/exercises';

interface ExerciseStore {
  exercises: Exercise[];
  filterByRegion: (region: Exercise['bodyRegion']) => Exercise[];
  filterByCategory: (category: Exercise['category']) => Exercise[];
  filterByDifficulty: (difficulty: Exercise['difficulty']) => Exercise[];
  searchExercises: (query: string) => Exercise[];
}

export const useExerciseStore = create<ExerciseStore>((set, get) => ({
  exercises: mockExercises,

  filterByRegion: (region) =>
    get().exercises.filter((e) => e.bodyRegion === region),

  filterByCategory: (category) =>
    get().exercises.filter((e) => e.category === category),

  filterByDifficulty: (difficulty) =>
    get().exercises.filter((e) => e.difficulty === difficulty),

  searchExercises: (query) => {
    const lower = query.toLowerCase();
    return get().exercises.filter(
      (e) =>
        e.name.toLowerCase().includes(lower) ||
        e.description.toLowerCase().includes(lower) ||
        e.bodyRegion.toLowerCase().includes(lower) ||
        e.category.toLowerCase().includes(lower)
    );
  },
}));
