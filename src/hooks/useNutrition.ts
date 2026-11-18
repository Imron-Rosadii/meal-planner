import { useMemo } from "react";

import type { Database } from "../types/database.types";

type MealSchedule = Database["public"]["Tables"]["meal_schedules"]["Row"];

interface UseNutritionOptions {
  schedules: MealSchedule[];
  calorieGoal?: number;
}

interface NutritionSummary {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  calorieGoal: number;
  calorieProgress: number;
  remainingCalories: number;
}

export function useNutrition({
  schedules,
  calorieGoal = 2000,
}: UseNutritionOptions): NutritionSummary {
  return useMemo(() => {
    const totals = schedules.reduce(
      (accumulator, schedule) => ({
        calories: accumulator.calories + schedule.calories,
        protein: accumulator.protein + schedule.protein,
        carbohydrates: accumulator.carbohydrates + schedule.carbohydrates,
        fat: accumulator.fat + schedule.fat,
      }),
      {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
      },
    );

    const calorieProgress =
      calorieGoal > 0
        ? Math.min((totals.calories / calorieGoal) * 100, 100)
        : 0;

    return {
      calories: totals.calories,
      protein: totals.protein,
      carbohydrates: totals.carbohydrates,
      fat: totals.fat,
      calorieGoal,
      calorieProgress,
      remainingCalories: Math.max(calorieGoal - totals.calories, 0),
    };
  }, [schedules, calorieGoal]);
}
