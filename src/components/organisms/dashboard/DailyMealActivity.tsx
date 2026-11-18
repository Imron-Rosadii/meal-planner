import { format } from "date-fns";
import { Clock, Utensils } from "lucide-react";

import Badge from "../../atoms/Badge";
import DailyMealEmptyState from "./DailyMealEmptyState";

import type { Database } from "../../../types/database.types";

type MealType = Database["public"]["Enums"]["meal_type"];
type MealSchedule = Database["public"]["Tables"]["meal_schedules"]["Row"];

interface DailyMealActivityProps {
  selectedDate: Date;
  dailySchedules: MealSchedule[];
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

export default function DailyMealActivity({
  selectedDate,
  dailySchedules,
}: DailyMealActivityProps) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <Utensils size={20} className="text-emerald-600" />
          <h2 className="font-semibold text-slate-800">Daily Meal Activity</h2>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          {format(selectedDate, "EEEE, dd MMMM yyyy")}
        </p>
      </div>

      {dailySchedules.length === 0 ? (
        <DailyMealEmptyState />
      ) : (
        <div className="space-y-5">
          {mealSections.map((section) => {
            const sectionSchedules = dailySchedules.filter(
              (schedule) => schedule.meal_type === section.value,
            );

            if (sectionSchedules.length === 0) {
              return null;
            }

            return (
              <div key={section.value}>
                <div className="mb-3 flex items-center gap-2">
                  <Badge
                    variant="default"
                    className={mealTypeColors[section.value]}
                  >
                    {section.label}
                  </Badge>

                  <span className="text-xs text-slate-500">
                    {sectionSchedules.length} meals
                  </span>
                </div>

                <div className="space-y-3">
                  {sectionSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex flex-col justify-between gap-2 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center"
                    >
                      <div className="min-w-0">
                        <h3 className="font-medium text-slate-800 wrap-break-word">
                          {schedule.meal_name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500 wrap-break-word">
                          {schedule.calories} kcal · {schedule.protein}g protein
                          · {schedule.carbohydrates}g carbs · {schedule.fat}g
                          fat
                        </p>

                        {schedule.notes && (
                          <p className="mt-1 text-sm text-slate-500 wrap-break-word">
                            {schedule.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-2 text-xs text-slate-500">
                        <Clock size={14} />
                        {section.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
