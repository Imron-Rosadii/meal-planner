import {
  Activity,
  BarChart3,
  CalendarDays,
  Flame,
  TrendingUp,
} from "lucide-react";

import type { AnalyticsSummary } from "../../../types/analytics";
import { formatNumber } from "../../../utils/analytics";

interface WeeklySummaryProps {
  summary: AnalyticsSummary;
}

function WeeklySummary({ summary }: WeeklySummaryProps) {
  const cards = [
    {
      label: "Total Calories",
      value: formatNumber(summary.totalCalories),
      description: "kcal this week",
      icon: Flame,
      iconColor: "text-orange-500",
    },
    {
      label: "Average Calories",
      value: formatNumber(summary.averageCalories),
      description: "kcal per active day",
      icon: BarChart3,
      iconColor: "text-blue-500",
    },
    {
      label: "Protein",
      value: `${formatNumber(summary.totalProtein)} g`,
      description: "Total protein intake",
      icon: TrendingUp,
      iconColor: "text-green-600",
    },
    {
      label: "Active Days",
      value: summary.activeDayCount,
      description: "Days with meal records",
      icon: CalendarDays,
      iconColor: "text-purple-500",
    },
  ];

  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <Activity size={20} className="text-green-600" />

        <h2 className="font-semibold text-slate-800">Weekly Summary</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-slate-500">{card.label}</p>

                <Icon size={19} className={card.iconColor} />
              </div>

              <p className="text-2xl font-bold text-slate-800">
                {card.value}
                {card.label === "Active Days" && (
                  <span className="text-base font-medium text-slate-400">
                    {" "}
                    / 7
                  </span>
                )}
              </p>

              <p className="mt-1 text-xs text-slate-500">{card.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default WeeklySummary;
