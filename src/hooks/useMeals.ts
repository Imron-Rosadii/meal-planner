import { useCallback, useEffect, useState } from "react";

import {
  archiveMeal,
  createMeal,
  deleteMeal,
  getMeals,
  restoreMeal,
  updateMeal,
  type CreateMealInput,
  type GetMealsOptions,
  type UpdateMealInput,
} from "../services/mealService";

import type { Database } from "../types/database.types";

type Meal = Database["public"]["Tables"]["meals"]["Row"];

interface UseMealsReturn {
  meals: Meal[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addMeal: (input: CreateMealInput) => Promise<Meal>;
  editMeal: (id: string, input: UpdateMealInput) => Promise<Meal>;
  archive: (id: string) => Promise<Meal>;
  restore: (id: string) => Promise<Meal>;
  remove: (id: string) => Promise<void>;
}

export function useMeals(options: GetMealsOptions = {}): UseMealsReturn {
  const { search, category, includeArchived = false } = options;

  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = useCallback(async () => {
    return getMeals({
      search,
      category,
      includeArchived,
    });
  }, [search, category, includeArchived]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchMeals();
      setMeals(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load meals.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [fetchMeals]);

  useEffect(() => {
    let isActive = true;

    const loadMeals = async () => {
      try {
        const data = await fetchMeals();

        if (isActive) {
          setMeals(data);
          setError(null);
        }
      } catch (err) {
        if (isActive) {
          const message =
            err instanceof Error ? err.message : "Failed to load meals.";

          setError(message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadMeals();

    return () => {
      isActive = false;
    };
  }, [fetchMeals]);

  const addMeal = async (input: CreateMealInput) => {
    try {
      const meal = await createMeal(input);
      await refetch();
      return meal;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create meal.";

      setError(message);
      throw err;
    }
  };

  const editMeal = async (id: string, input: UpdateMealInput) => {
    try {
      const meal = await updateMeal(id, input);
      await refetch();
      return meal;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update meal.";

      setError(message);
      throw err;
    }
  };

  const archive = async (id: string) => {
    try {
      const meal = await archiveMeal(id);
      await refetch();
      return meal;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to archive meal.";

      setError(message);
      throw err;
    }
  };

  const restore = async (id: string) => {
    try {
      const meal = await restoreMeal(id);
      await refetch();
      return meal;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to restore meal.";

      setError(message);
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteMeal(id);
      await refetch();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete meal.";

      setError(message);
      throw err;
    }
  };

  return {
    meals,
    loading,
    error,
    refetch,
    addMeal,
    editMeal,
    archive,
    restore,
    remove,
  };
}
