import { Beef, Flame, Wheat, Droplets } from "lucide-react";

interface NutritionSummaryProps {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  calorieGoal: number;
  proteinGoal: number;
  carbohydratesGoal: number;
  fatGoal: number;
}

const nutritionItems = [
  {
    key: "protein",
    label: "Protein",
    icon: Beef,
    color: "text-pink-600",
    background: "bg-pink-50",
    progressColor: "bg-pink-500",
    unit: "g",
  },
  {
    key: "carbohydrates",
    label: "Carbs",
    icon: Wheat,
    color: "text-blue-600",
    background: "bg-blue-50",
    progressColor: "bg-blue-500",
    unit: "g",
  },
  {
    key: "fat",
    label: "Fat",
    icon: Droplets,
    color: "text-purple-600",
    background: "bg-purple-50",
    progressColor: "bg-purple-500",
    unit: "g",
  },
] as const;

function NutritionSummary({
  calories,
  protein,
  carbohydrates,
  fat,
  calorieGoal,
  proteinGoal,
  carbohydratesGoal,
  fatGoal,
}: NutritionSummaryProps) {
  const calorieProgress = calorieGoal > 0 ? (calories / calorieGoal) * 100 : 0;

  const nutritionValues = {
    protein,
    carbohydrates,
    fat,
  };

  const nutritionGoals = {
    protein: proteinGoal,
    carbohydrates: carbohydratesGoal,
    fat: fatGoal,
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-semibold text-slate-800">Daily Nutrition</h2>
        <p className="mt-1 text-sm text-slate-500">
          Your daily nutrition overview
        </p>
      </div>

      {/* Calories */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
              <Flame size={22} />
            </div>

            <div>
              <p className="text-sm text-slate-500">Total Calories</p>
              <p className="text-2xl font-bold text-slate-800">
                {Math.round(calories).toLocaleString()}{" "}
                <span className="text-sm font-normal text-slate-500">kcal</span>
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            Goal: {calorieGoal.toLocaleString()} kcal
          </p>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-xs text-slate-500">
            <span>Daily goal progress</span>
            <span>{calorieProgress.toFixed(0)}%</span>
          </div>

          <div
            className="h-2 overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-label="Daily calorie goal progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.min(Math.round(calorieProgress), 100)}
          >
            <div
              className="h-full rounded-full bg-pink-500 transition-all"
              style={{
                width: `${Math.min(calorieProgress, 100)}%`,
              }}
            />
          </div>

          {calories > calorieGoal && (
            <p className="mt-2 text-xs text-amber-600">
              You have exceeded your daily calorie goal.
            </p>
          )}
        </div>
      </div>

      {/* Macronutrients */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {nutritionItems.map((item) => {
          const Icon = item.icon;
          const value = nutritionValues[item.key];
          const goal = nutritionGoals[item.key];
          const progress = goal > 0 ? (value / goal) * 100 : 0;

          return (
            <div
              key={item.key}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div
                className={`mb-3 inline-flex rounded-lg p-2 ${item.background} ${item.color}`}
              >
                <Icon size={19} />
              </div>

              <p className="text-sm text-slate-500">{item.label}</p>

              <p className="mt-1 text-xl font-bold text-slate-800">
                {value.toFixed(1)}{" "}
                <span className="text-sm font-normal text-slate-500">
                  {item.unit}
                </span>
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Goal: {goal.toLocaleString()} {item.unit}
              </p>

              <div className="mt-3">
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>Progress</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>

                <div
                  className="h-1.5 overflow-hidden rounded-full bg-slate-100"
                  role="progressbar"
                  aria-label={`${item.label} goal progress`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.min(Math.round(progress), 100)}
                >
                  <div
                    className={`h-full rounded-full transition-all ${item.progressColor}`}
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default NutritionSummary;
