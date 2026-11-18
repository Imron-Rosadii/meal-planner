import { Activity, Award, TrendingDown, TrendingUp } from "lucide-react";

import type { AnalyticsSummary } from "../../../types/analytics";
import { formatNumber } from "../../../utils/analytics";

interface NutritionInsightsProps {
  summary: AnalyticsSummary;
}

function NutritionInsights({ summary }: NutritionInsightsProps) {
  const insights = [];

  if (summary.highestDay) {
    insights.push({
      title: "Highest Calorie Day",
      description: `${summary.highestDay.day} had the highest intake with ${formatNumber(summary.highestDay.calories)} kcal.`,
      icon: TrendingUp,
      color: "text-orange-500",
      background: "bg-orange-50",
    });
  }

  if (summary.lowestDay) {
    insights.push({
      title: "Lowest Calorie Day",
      description: `${summary.lowestDay.day} had the lowest intake with ${formatNumber(summary.lowestDay.calories)} kcal.`,
      icon: TrendingDown,
      color: "text-blue-500",
      background: "bg-blue-50",
    });
  }

  insights.push({
    title: "Active Days",
    description: `You recorded meals on ${summary.activeDayCount} out of 7 days this week.`,
    icon: Activity,
    color: "text-green-600",
    background: "bg-green-50",
  });

  insights.push({
    title: "Weekly Protein Intake",
    description: `You consumed ${formatNumber(summary.totalProtein)} g of protein this week.`,
    icon: Award,
    color: "text-purple-500",
    background: "bg-purple-50",
  });

  return (
    <section>
      <div className="mb-4">
        <h2 className="font-semibold text-slate-800">Nutrition Insights</h2>
        <p className="mt-1 text-sm text-slate-500">
          Highlights from your weekly nutrition activity
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {insights.map((insight) => {
          const Icon = insight.icon;

          return (
            <div
              key={insight.title}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className={`rounded-lg p-2 ${insight.background}`}>
                <Icon size={19} className={insight.color} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  {insight.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {insight.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default NutritionInsights;
