import { useMemo, useState } from "react";
import { addDays, endOfWeek, format, startOfWeek } from "date-fns";

import { useMealSchedules } from "./useMealSchedules";
import { useNutrition } from "./useNutrition";
import { useNutritionGoals } from "./useNutritionGoals";

export function useDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });

  const startDate = format(weekStart, "yyyy-MM-dd");
  const endDate = format(weekEnd, "yyyy-MM-dd");
  const selectedDateString = format(selectedDate, "yyyy-MM-dd");

  const { schedules, loading, error } = useMealSchedules(startDate, endDate);

  const {
    goals,
    loading: goalsLoading,
    error: goalsError,
  } = useNutritionGoals();

  const dailySchedules = useMemo(
    () => schedules.filter((schedule) => schedule.date === selectedDateString),
    [schedules, selectedDateString],
  );

  const dailyNutrition = useNutrition({
    schedules: dailySchedules,
  });

  const weeklyNutrition = useNutrition({
    schedules,
  });

  const weeklySummary = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = addDays(weekStart, index);
        const dateKey = format(date, "yyyy-MM-dd");

        const daySchedules = schedules.filter(
          (schedule) => schedule.date === dateKey,
        );

        return {
          date: format(date, "EEE"),
          calories: daySchedules.reduce(
            (total, schedule) => total + schedule.calories,
            0,
          ),
        };
      }),
    [weekStart, schedules],
  );

  return {
    selectedDate,
    setSelectedDate,
    weekStart,
    weekEnd,
    dailySchedules,
    dailyNutrition,
    weeklyNutrition,
    weeklySummary,
    goals,
    schedulesLoading: loading,
    goalsLoading,
    error,
    goalsError,
  };
}
