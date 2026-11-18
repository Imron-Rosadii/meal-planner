import type { DailyNutrition } from "../../../types/analytics";
import { formatNumber } from "../../../utils/analytics";

interface DailyNutritionTableProps {
  dailyData: DailyNutrition[];
}

function DailyNutritionTable({ dailyData }: DailyNutritionTableProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-5">
        <h2 className="font-semibold text-slate-800">
          Daily Nutrition Breakdown
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Detailed nutrition intake for each day of the week
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-150 text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="px-4 py-3 font-medium">Day</th>
              <th className="px-4 py-3 text-right font-medium">Meals</th>
              <th className="px-4 py-3 text-right font-medium">Calories</th>
              <th className="px-4 py-3 text-right font-medium">Protein</th>
              <th className="px-4 py-3 text-right font-medium">Carbs</th>
              <th className="px-4 py-3 text-right font-medium">Fat</th>
            </tr>
          </thead>

          <tbody>
            {dailyData.map((day) => (
              <tr
                key={day.date}
                className="border-b border-slate-100 last:border-0"
              >
                <td className="px-4 py-3 font-medium text-slate-700">
                  {day.day}
                </td>
                <td className="px-4 py-3 text-right text-slate-600">
                  {day.mealCount}
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-700">
                  {formatNumber(day.calories)}
                </td>
                <td className="px-4 py-3 text-right text-slate-600">
                  {formatNumber(day.protein)} g
                </td>
                <td className="px-4 py-3 text-right text-slate-600">
                  {formatNumber(day.carbohydrates)} g
                </td>
                <td className="px-4 py-3 text-right text-slate-600">
                  {formatNumber(day.fat)} g
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default DailyNutritionTable;
