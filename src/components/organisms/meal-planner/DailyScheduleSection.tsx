import {
  CalendarDays,
  Clock,
  Pencil,
  Plus,
  Trash2,
  Utensils,
} from "lucide-react";
import { format } from "date-fns";

import Button from "../../atoms/Button";
import Badge from "../../atoms/Badge";
import Spinner from "../../atoms/Spinner";

import type { Database } from "../../../types/database.types";

type MealSchedule = Database["public"]["Tables"]["meal_schedules"]["Row"];

type MealType = Database["public"]["Enums"]["meal_type"];

interface DailyScheduleSectionProps {
  selectedDate: Date;
  schedules: MealSchedule[];
  isLoading: boolean;
  error: string | null;
  onAdd: () => void;
  onEdit: (schedule: MealSchedule) => void;
  onDelete: (schedule: MealSchedule) => void;
}

const mealSections: {
  value: MealType;
  label: string;
}[] = [
  { value: "breakfast", label: "Breakfast" },
  { value: "lunch", label: "Lunch" },
  { value: "dinner", label: "Dinner" },
  { value: "snack", label: "Snack" },
];

const mealTypeColors: Record<MealType, string> = {
  breakfast: "bg-amber-50 text-amber-700",
  lunch: "bg-emerald-50 text-emerald-700",
  dinner: "bg-indigo-50 text-indigo-700",
  snack: "bg-purple-50 text-purple-700",
};

export default function DailyScheduleSection({
  selectedDate,
  schedules,
  isLoading,
  error,
  onAdd,
  onEdit,
  onDelete,
}: DailyScheduleSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays size={20} className="shrink-0 text-emerald-600" />

            <h2 className="text-lg font-bold text-slate-900">Daily Schedule</h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {format(selectedDate, "EEEE, dd MMMM yyyy")}
          </p>
        </div>

        <Button
          onClick={onAdd}
          fullWidth
          className="sm:w-auto"
          leftIcon={<Plus size={18} />}
        >
          Add Meal
        </Button>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex min-h-56 items-center justify-center">
          <Spinner size="lg" label="Loading meal schedules..." />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {mealSections.map((section) => {
            const sectionSchedules = schedules.filter(
              (schedule) => schedule.meal_type === section.value,
            );

            return (
              <div key={section.value}>
                <div className="mb-3 flex items-center gap-2">
                  <Badge
                    variant="default"
                    className={mealTypeColors[section.value]}
                  >
                    {section.label}
                  </Badge>

                  <span className="text-xs text-slate-400">
                    {sectionSchedules.length} meals
                  </span>
                </div>

                {sectionSchedules.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-center">
                    <p className="text-sm text-slate-400">
                      No {section.label.toLowerCase()} scheduled.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sectionSchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="rounded-xl border border-slate-100 p-3 transition hover:border-emerald-200 sm:p-4"
                      >
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <Utensils
                                size={17}
                                className="shrink-0 text-emerald-600"
                              />

                              <h3 className="wrap-break-word font-semibold text-slate-900">
                                {schedule.meal_name}
                              </h3>
                            </div>

                            <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                              {schedule.calories} kcal · {schedule.protein}g
                              protein · {schedule.carbohydrates}g carbs ·{" "}
                              {schedule.fat}g fat
                            </p>

                            {schedule.notes && (
                              <p className="mt-2 wrap-break-word text-sm text-slate-500">
                                {schedule.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex shrink-0 items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onEdit(schedule)}
                              leftIcon={<Pencil size={14} />}
                            >
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onDelete(schedule)}
                              leftIcon={<Trash2 size={14} />}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-6 flex items-start gap-2 text-xs text-slate-400">
        <Clock size={14} className="mt-0.5 shrink-0" />

        <span>
          Nutrition totals are calculated from meals scheduled for the selected
          date.
        </span>
      </div>
    </section>
  );
}
