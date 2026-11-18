interface DailyNutritionCardsProps {
  nutrition: {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    calorieGoal: number;
    calorieProgress: number;
  };
}

export default function DailyNutritionCards({
  nutrition,
}: DailyNutritionCardsProps) {
  const cards = [
    {
      label: "Calories",
      value: Math.round(nutrition.calories).toLocaleString("en-US"),
      unit: `of ${nutrition.calorieGoal.toLocaleString("en-US")} kcal`,
    },
    {
      label: "Protein",
      value: `${nutrition.protein.toFixed(1)}g`,
    },
    {
      label: "Carbohydrates",
      value: `${nutrition.carbohydrates.toFixed(1)}g`,
    },
    {
      label: "Fat",
      value: `${nutrition.fat.toFixed(1)}g`,
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="min-w-0 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:p-4"
        >
          <p className="text-xs text-slate-500 sm:text-sm">{card.label}</p>

          <p className="mt-2 wrap-break-word text-xl font-bold text-slate-900 sm:text-2xl">
            {card.value}
          </p>

          {card.unit && (
            <p className="mt-1 text-xs text-slate-400">{card.unit}</p>
          )}

          {card.label === "Calories" && (
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${nutrition.calorieProgress}%`,
                }}
              />
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
