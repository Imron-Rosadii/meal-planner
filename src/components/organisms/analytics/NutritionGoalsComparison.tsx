import type {
  AnalyticsSummary,
  NutritionGoalsData,
} from "../../../types/analytics";
import { formatNumber, getProgress } from "../../../utils/analytics";

interface NutritionGoalsComparisonProps {
  summary: AnalyticsSummary;
  goals: NutritionGoalsData;
}

function ProgressBar({
  value,
  target,
  color,
}: {
  value: number;
  target: number;
  color: string;
}) {
  const percentage = getProgress(value, target);

  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${color}`}
        style={{
          width: `${Math.min(percentage, 100)}%`,
        }}
      />
    </div>
  );
}

function NutritionGoalsComparison({
  summary,
  goals,
}: NutritionGoalsComparisonProps) {
  const items = [
    {
      label: "Calories",
      value: summary.averageCalories,
      target: goals.calories,
      unit: "kcal",
      color: "bg-orange-500",
    },
    {
      label: "Protein",
      value: summary.averageProtein,
      target: goals.protein,
      unit: "g",
      color: "bg-green-500",
    },
    {
      label: "Carbohydrates",
      value: summary.averageCarbohydrates,
      target: goals.carbohydrates,
      unit: "g",
      color: "bg-blue-500",
    },
    {
      label: "Fat",
      value: summary.averageFat,
      target: goals.fat,
      unit: "g",
      color: "bg-amber-500",
    },
  ];

  return (
    <section>
      <div className="mb-4">
        <h2 className="font-semibold text-slate-800">Nutrition Goals</h2>

        <p className="mt-1 text-sm text-slate-500">
          Average daily intake compared with your reference targets
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const progress = getProgress(item.value, item.target);

          return (
            <div
              key={item.label}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium text-slate-700">{item.label}</h3>

                <span className="text-sm font-semibold text-slate-600">
                  {progress}%
                </span>
              </div>

              <div className="mb-3 flex items-baseline justify-between gap-2">
                <p className="text-xl font-bold text-slate-800">
                  {formatNumber(item.value)}{" "}
                  <span className="text-sm font-medium text-slate-500">
                    {item.unit}
                  </span>
                </p>

                <p className="text-xs text-slate-500">
                  Target: {formatNumber(item.target)} {item.unit}
                </p>
              </div>

              <ProgressBar
                value={item.value}
                target={item.target}
                color={item.color}
              />

              <p className="mt-2 text-xs text-slate-500">
                {progress >= 100
                  ? "Reference target reached or exceeded"
                  : `${formatNumber(
                      Math.max(item.target - item.value, 0),
                    )} ${item.unit} below target`}
              </p>
            </div>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-slate-400">
        Reference targets are configurable defaults, not personalized medical or
        dietary advice.
      </p>
    </section>
  );
}

export default NutritionGoalsComparison;
