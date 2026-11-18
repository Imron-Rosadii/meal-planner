import { useCallback, useEffect, useState } from "react";

import {
  getNutritionGoals,
  updateNutritionGoals,
  type NutritionGoals,
  type UpdateNutritionGoalsInput,
} from "../services/nutritionGoalService";

interface UseNutritionGoalsReturn {
  goals: NutritionGoals | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  saveGoals: (input: UpdateNutritionGoalsInput) => Promise<NutritionGoals>;
}

export function useNutritionGoals(): UseNutritionGoalsReturn {
  const [goals, setGoals] = useState<NutritionGoals | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getNutritionGoals();
      setGoals(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load nutrition goals.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveGoals = useCallback(async (input: UpdateNutritionGoalsInput) => {
    setSaving(true);
    setError(null);

    try {
      const updatedGoals = await updateNutritionGoals(input);
      setGoals(updatedGoals);

      return updatedGoals;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update nutrition goals.";

      setError(message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadGoals = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getNutritionGoals();

        if (isActive) {
          setGoals(data);
        }
      } catch (err) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load nutrition goals.",
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadGoals();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    goals,
    loading,
    saving,
    error,
    refetch,
    saveGoals,
  };
}
