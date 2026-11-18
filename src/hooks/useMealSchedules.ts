import { useCallback, useEffect, useState } from "react";

import {
  createMealSchedule,
  deleteMealSchedule,
  getMealSchedulesByDateRange,
  updateMealSchedule,
  type CreateMealScheduleInput,
  type UpdateMealScheduleInput,
} from "../services/mealScheduleService";

import type { Database } from "../types/database.types";

type MealSchedule = Database["public"]["Tables"]["meal_schedules"]["Row"];

interface UseMealSchedulesReturn {
  schedules: MealSchedule[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addSchedule: (input: CreateMealScheduleInput) => Promise<MealSchedule>;
  editSchedule: (
    id: string,
    input: UpdateMealScheduleInput,
  ) => Promise<MealSchedule>;
  removeSchedule: (id: string) => Promise<void>;
}

export function useMealSchedules(
  startDate: string,
  endDate: string,
): UseMealSchedulesReturn {
  const [schedules, setSchedules] = useState<MealSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchedules = useCallback(async () => {
    return getMealSchedulesByDateRange(startDate, endDate);
  }, [startDate, endDate]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchSchedules();
      setSchedules(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load meal schedules.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetchSchedules]);

  useEffect(() => {
    let isActive = true;

    const loadSchedules = async () => {
      try {
        const data = await fetchSchedules();

        if (isActive) {
          setSchedules(data);
          setError(null);
        }
      } catch (err) {
        if (isActive) {
          const message =
            err instanceof Error
              ? err.message
              : "Failed to load meal schedules.";

          setError(message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadSchedules();

    return () => {
      isActive = false;
    };
  }, [fetchSchedules]);

  const addSchedule = async (input: CreateMealScheduleInput) => {
    try {
      const schedule = await createMealSchedule(input);
      await refetch();
      return schedule;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create meal schedule.";

      setError(message);
      throw err;
    }
  };

  const editSchedule = async (id: string, input: UpdateMealScheduleInput) => {
    try {
      const schedule = await updateMealSchedule(id, input);
      await refetch();
      return schedule;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update meal schedule.";

      setError(message);
      throw err;
    }
  };

  const removeSchedule = async (id: string) => {
    try {
      await deleteMealSchedule(id);
      await refetch();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete meal schedule.";

      setError(message);
      throw err;
    }
  };

  return {
    schedules,
    loading,
    error,
    refetch,
    addSchedule,
    editSchedule,
    removeSchedule,
  };
}
