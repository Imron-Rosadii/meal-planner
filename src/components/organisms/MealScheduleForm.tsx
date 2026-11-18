import { useState, type FormEvent } from "react";

import Button from "../atoms/Button";
import FormField from "../molecules/FormField";

import type { Database } from "../../types/database.types";

type Meal = Database["public"]["Tables"]["meals"]["Row"];
type MealSchedule = Database["public"]["Tables"]["meal_schedules"]["Row"];
type MealType = Database["public"]["Enums"]["meal_type"];

export interface MealScheduleFormValues {
  mealId: string;
  date: string;
  mealType: MealType;
  notes: string;
}

interface MealScheduleFormProps {
  meals: Meal[];
  selectedDate: string;
  initialSchedule?: MealSchedule | null;
  isSubmitting?: boolean;
  onSubmit: (values: MealScheduleFormValues) => Promise<void>;
  onCancel: () => void;
}

const mealTypes: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

export default function MealScheduleForm({
  meals,
  selectedDate,
  initialSchedule,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: MealScheduleFormProps) {
  const [mealId, setMealId] = useState(initialSchedule?.meal_id ?? "");
  const [date, setDate] = useState(initialSchedule?.date ?? selectedDate);
  const [mealType, setMealType] = useState<MealType>(
    initialSchedule?.meal_type ?? "breakfast",
  );
  const [notes, setNotes] = useState(initialSchedule?.notes ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!initialSchedule && !mealId) {
      setError("Please select a meal.");
      return;
    }

    try {
      await onSubmit({
        mealId,
        date,
        mealType,
        notes: notes.trim(),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save meal schedule.",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {initialSchedule ? (
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Selected Meal
          </p>
          <p className="mt-1 font-semibold text-slate-900">
            {initialSchedule.meal_name}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {initialSchedule.calories} kcal · {initialSchedule.protein}g protein
          </p>
        </div>
      ) : (
        <FormField label="Select Meal" htmlFor="schedule-meal" required>
          <select
            id="schedule-meal"
            value={mealId}
            onChange={(event) => setMealId(event.target.value)}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">Choose a meal</option>
            {meals.map((meal) => (
              <option key={meal.id} value={meal.id}>
                {meal.name} — {meal.calories} kcal
              </option>
            ))}
          </select>

          {meals.length === 0 && (
            <p className="mt-2 text-xs text-amber-600">
              Your Meal Library is empty. Add a meal before scheduling.
            </p>
          )}
        </FormField>
      )}

      <FormField label="Date" htmlFor="schedule-date" required>
        <input
          id="schedule-date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </FormField>

      <FormField label="Meal Time" htmlFor="schedule-type" required>
        <select
          id="schedule-type"
          value={mealType}
          onChange={(event) => setMealType(event.target.value as MealType)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          {mealTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Notes" htmlFor="schedule-notes">
        <textarea
          id="schedule-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Add any notes about this meal..."
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </FormField>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!initialSchedule && meals.length === 0}
        >
          {initialSchedule ? "Save Changes" : "Add to Planner"}
        </Button>
      </div>
    </form>
  );
}
