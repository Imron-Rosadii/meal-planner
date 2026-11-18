import { useMemo, useState } from "react";
import { endOfWeek, format, startOfWeek } from "date-fns";

import { useMeals } from "./useMeals";
import { useMealSchedules } from "./useMealSchedules";
import { useNutrition } from "./useNutrition";

import type { Database } from "../types/database.types";
import type { MealScheduleFormValues } from "../components/organisms/MealScheduleForm";

type MealSchedule = Database["public"]["Tables"]["meal_schedules"]["Row"];

export function useMealPlanner() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<MealSchedule | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [scheduleToDelete, setScheduleToDelete] = useState<MealSchedule | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const weekStart = startOfWeek(selectedDate, {
    weekStartsOn: 1,
  });

  const weekEnd = endOfWeek(selectedDate, {
    weekStartsOn: 1,
  });

  const startDate = format(weekStart, "yyyy-MM-dd");
  const endDate = format(weekEnd, "yyyy-MM-dd");
  const selectedDateString = format(selectedDate, "yyyy-MM-dd");

  const { meals, error: mealsError } = useMeals();

  const {
    schedules,
    loading: schedulesLoading,
    error: schedulesError,
    addSchedule,
    editSchedule,
    removeSchedule,
  } = useMealSchedules(startDate, endDate);

  const selectedSchedules = useMemo(
    () => schedules.filter((schedule) => schedule.date === selectedDateString),
    [schedules, selectedDateString],
  );

  const nutrition = useNutrition({
    schedules: selectedSchedules,
  });

  const openCreateForm = () => {
    setSelectedSchedule(null);
    setActionError(null);
    setIsFormOpen(true);
  };

  const openEditForm = (schedule: MealSchedule) => {
    setSelectedSchedule(schedule);
    setActionError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (isSubmitting) return;

    setIsFormOpen(false);
    setSelectedSchedule(null);
    setActionError(null);
  };

  const handleSaveSchedule = async (values: MealScheduleFormValues) => {
    setIsSubmitting(true);
    setActionError(null);

    try {
      if (selectedSchedule) {
        await editSchedule(selectedSchedule.id, {
          date: values.date,
          meal_type: values.mealType,
          notes: values.notes || null,
        });
      } else {
        const meal = meals.find((item) => item.id === values.mealId);

        if (!meal) {
          throw new Error("Selected meal could not be found.");
        }

        await addSchedule({
          meal_id: meal.id,
          meal_name: meal.name,
          category: meal.category,
          date: values.date,
          meal_type: values.mealType,
          calories: meal.calories,
          protein: meal.protein,
          carbohydrates: meal.carbohydrates,
          fat: meal.fat,
          notes: values.notes || null,
        });
      }

      setIsFormOpen(false);
      setSelectedSchedule(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save meal schedule.";

      setActionError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDeleteConfirmation = (schedule: MealSchedule) => {
    setActionError(null);
    setScheduleToDelete(schedule);
  };

  const closeDeleteConfirmation = () => {
    if (isDeleting) return;

    setScheduleToDelete(null);
  };

  const confirmDeleteSchedule = async () => {
    if (!scheduleToDelete || isDeleting) return;

    setIsDeleting(true);
    setActionError(null);

    try {
      await removeSchedule(scheduleToDelete.id);
      setScheduleToDelete(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete meal schedule.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedDateString,
    meals,
    selectedSchedules,
    nutrition,
    isLoading: schedulesLoading,
    pageError: actionError || schedulesError || mealsError,
    isFormOpen,
    selectedSchedule,
    isSubmitting,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSaveSchedule,
    scheduleToDelete,
    isDeleting,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    confirmDeleteSchedule,
  };
}
