import { useMemo } from "react";
import { eachDayOfInterval, format, parseISO } from "date-fns";

import { useMealSchedules } from "./useMealSchedules";
import { useNutritionGoals } from "./useNutritionGoals";

import type {
  AnalyticsSummary,
  DailyNutrition,
  MacroDistributionItem,
  NutritionGoalsData,
} from "../types/analytics";

interface UseAnalyticsReturn {
  dailyData: DailyNutrition[];
  summary: AnalyticsSummary;
  nutritionGoals: NutritionGoalsData;
  macroDistribution: MacroDistributionItem[];
  totalMacroCalories: number;
  hasData: boolean;
  isPageLoading: boolean;
  pageError: string | null;
}

export function useAnalytics(
  startDate: string,
  endDate: string,
): UseAnalyticsReturn {
  // Fetch weekly meal schedules.
  const { schedules, loading, error } = useMealSchedules(startDate, endDate);

  // Fetch user's nutrition goals.
  const {
    goals,
    loading: goalsLoading,
    error: goalsError,
  } = useNutritionGoals();

  // Use default targets when goals are not available.
  const nutritionGoals: NutritionGoalsData = {
    calories: goals?.calories_goal ?? 2000,
    protein: goals?.protein_goal ?? 125,
    carbohydrates: goals?.carbohydrates_goal ?? 250,
    fat: goals?.fat_goal ?? 56,
  };

  // Calculate daily nutrition and weekly summary.
  const analyticsData = useMemo(() => {
    const days = eachDayOfInterval({
      start: parseISO(startDate),
      end: parseISO(endDate),
    });

    const dailyData: DailyNutrition[] = days.map((day) => {
      const dateKey = format(day, "yyyy-MM-dd");

      const daySchedules = schedules.filter(
        (schedule) => schedule.date === dateKey,
      );

      const totals = daySchedules.reduce(
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

      return {
        date: dateKey,
        day: format(day, "EEE"),
        mealCount: daySchedules.length,
        ...totals,
      };
    });

    const totalCalories = dailyData.reduce(
      (total, day) => total + day.calories,
      0,
    );

    const totalProtein = dailyData.reduce(
      (total, day) => total + day.protein,
      0,
    );

    const totalCarbohydrates = dailyData.reduce(
      (total, day) => total + day.carbohydrates,
      0,
    );

    const totalFat = dailyData.reduce((total, day) => total + day.fat, 0);

    const activeDays = dailyData.filter((day) => day.mealCount > 0);

    const activeDayCount = activeDays.length;

    const averageCalories =
      activeDayCount > 0 ? Math.round(totalCalories / activeDayCount) : 0;

    const averageProtein =
      activeDayCount > 0 ? Math.round(totalProtein / activeDayCount) : 0;

    const averageCarbohydrates =
      activeDayCount > 0 ? Math.round(totalCarbohydrates / activeDayCount) : 0;

    const averageFat =
      activeDayCount > 0 ? Math.round(totalFat / activeDayCount) : 0;

    const highestDay =
      activeDays.length > 0
        ? activeDays.reduce((highest, current) =>
            current.calories > highest.calories ? current : highest,
          )
        : null;

    const lowestDay =
      activeDays.length > 0
        ? activeDays.reduce((lowest, current) =>
            current.calories < lowest.calories ? current : lowest,
          )
        : null;

    const summary: AnalyticsSummary = {
      totalCalories,
      totalProtein,
      totalCarbohydrates,
      totalFat,
      activeDayCount,
      averageCalories,
      averageProtein,
      averageCarbohydrates,
      averageFat,
      highestDay,
      lowestDay,
    };

    // Convert macronutrients into calories.
    const macroDistribution: MacroDistributionItem[] = [
      {
        name: "Protein",
        value: totalProtein * 4,
        color: "#3b82f6",
      },
      {
        name: "Carbs",
        value: totalCarbohydrates * 4,
        color: "#f59e0b",
      },
      {
        name: "Fat",
        value: totalFat * 9,
        color: "#ec4899",
      },
    ].filter((macro) => macro.value > 0);

    const totalMacroCalories = macroDistribution.reduce(
      (total, macro) => total + macro.value,
      0,
    );

    return {
      dailyData,
      summary,
      macroDistribution,
      totalMacroCalories,
    };
  }, [startDate, endDate, schedules]);

  return {
    ...analyticsData,
    nutritionGoals,
    hasData: schedules.length > 0,
    isPageLoading: loading || goalsLoading,
    pageError: error || goalsError,
  };
}
