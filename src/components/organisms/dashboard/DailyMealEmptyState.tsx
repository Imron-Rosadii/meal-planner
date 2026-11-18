import { Utensils } from "lucide-react";

export default function DailyMealEmptyState() {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 text-center">
      <Utensils size={28} className="mb-3 text-slate-300" />

      <p className="font-medium text-slate-700">No meals scheduled</p>

      <p className="mt-1 text-sm text-slate-400">
        There are no meals planned for this date.
      </p>
    </div>
  );
}
