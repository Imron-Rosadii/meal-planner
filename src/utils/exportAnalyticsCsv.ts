import { format, parseISO } from "date-fns";

import type { AnalyticsSummary, DailyNutrition } from "../types/analytics";

function escapeCsvValue(value: string | number): string {
  const stringValue = String(value);
  return `"${stringValue.replace(/"/g, '""')}"`;
}

export function exportAnalyticsCsv(
  dailyData: DailyNutrition[],
  summary: AnalyticsSummary,
  startDate: string,
  endDate: string,
): void {
  const headers = [
    "Date",
    "Day",
    "Calories (kcal)",
    "Protein (g)",
    "Carbohydrates (g)",
    "Fat (g)",
  ];

  const rows = dailyData.map((day) => [
    day.date,
    format(parseISO(day.date), "EEEE"),
    day.calories,
    day.protein,
    day.carbohydrates,
    day.fat,
  ]);

  const csvContent = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
    [
      "WEEKLY TOTAL",
      "",
      summary.totalCalories,
      summary.totalProtein,
      summary.totalCarbohydrates,
      summary.totalFat,
    ]
      .map(escapeCsvValue)
      .join(","),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF", csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `nutrition-report-${startDate}-to-${endDate}.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
