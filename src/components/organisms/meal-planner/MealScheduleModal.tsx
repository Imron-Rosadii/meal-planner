import MealScheduleForm, {
  type MealScheduleFormValues,
} from "../MealScheduleForm";

import type { Database } from "../../../types/database.types";

type Meal = Database["public"]["Tables"]["meals"]["Row"];

type MealSchedule = Database["public"]["Tables"]["meal_schedules"]["Row"];

interface MealScheduleModalProps {
  meals: Meal[];
  selectedDate: string;
  selectedSchedule: MealSchedule | null;
  isSubmitting: boolean;
  onSubmit: (values: MealScheduleFormValues) => Promise<void>;
  onCancel: () => void;
}

export default function MealScheduleModal({
  meals,
  selectedDate,
  selectedSchedule,
  isSubmitting,
  onSubmit,
  onCancel,
}: MealScheduleModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-form-title"
        className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:max-h-[calc(100dvh-2rem)] sm:p-6"
      >
        <div className="mb-6">
          <h2
            id="schedule-form-title"
            className="text-xl font-bold text-slate-900"
          >
            {selectedSchedule ? "Edit Meal Schedule" : "Add Meal to Planner"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {selectedSchedule
              ? "Update the date, meal time, or notes."
              : "Choose a meal from your library and schedule it."}
          </p>
        </div>

        <MealScheduleForm
          key={selectedSchedule?.id ?? "new-schedule"}
          meals={meals}
          selectedDate={selectedDate}
          initialSchedule={selectedSchedule}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}
