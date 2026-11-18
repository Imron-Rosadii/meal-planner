import { format, parseISO } from "date-fns";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { toPng } from "html-to-image";

import type {
  AnalyticsSummary,
  DailyNutrition,
  NutritionGoalsData,
} from "../types/analytics";

import { formatNumber, getProgress } from "./analytics";

interface ExportAnalyticsPdfParams {
  dailyData: DailyNutrition[];
  summary: AnalyticsSummary;
  nutritionGoals: NutritionGoalsData;
  startDate: string;
  endDate: string;
  calorieChart: HTMLDivElement | null;
  macroChart: HTMLDivElement | null;
}

function addMetricCard(
  doc: jsPDF,
  x: number,
  y: number,
  title: string,
  value: string,
  unit: string,
) {
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(x, y, 86, 27, 3, 3, "F");

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.text(title, x + 5, y + 8);

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(value, x + 5, y + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(unit, x + 5, y + 23);
}

async function captureChart(
  element: HTMLDivElement | null,
): Promise<string | null> {
  if (!element) return null;

  try {
    return await toPng(element, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      cacheBust: true,
    });
  } catch (error) {
    console.error("Failed to capture chart:", error);
    return null;
  }
}

export async function exportAnalyticsPdf({
  dailyData,
  summary,
  nutritionGoals,
  startDate,
  endDate,
  calorieChart,
  macroChart,
}: ExportAnalyticsPdfParams): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;

  const period = `${format(parseISO(startDate), "d MMM yyyy")} - ${format(
    parseISO(endDate),
    "d MMM yyyy",
  )}`;

  const generatedAt = format(new Date(), "d MMM yyyy, HH:mm");

  // Page 1: Summary and nutrition goals

  doc.setFillColor(22, 163, 74);
  doc.rect(0, 0, pageWidth, 38, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Weekly Nutrition Report", margin, 17);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(period, margin, 27);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8);
  doc.text(`Generated: ${generatedAt}`, margin, 45);

  addMetricCard(
    doc,
    margin,
    53,
    "Total Calories",
    formatNumber(summary.totalCalories),
    "kcal",
  );

  addMetricCard(
    doc,
    110,
    53,
    "Total Protein",
    formatNumber(summary.totalProtein),
    "grams",
  );

  addMetricCard(
    doc,
    margin,
    85,
    "Total Carbohydrates",
    formatNumber(summary.totalCarbohydrates),
    "grams",
  );

  addMetricCard(
    doc,
    110,
    85,
    "Total Fat",
    formatNumber(summary.totalFat),
    "grams",
  );

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Nutrition Goals Comparison", margin, 125);

  autoTable(doc, {
    startY: 130,
    margin: { left: margin, right: margin },
    head: [["Nutrient", "Actual Intake", "Daily Goal", "Progress"]],
    body: [
      [
        "Calories",
        `${formatNumber(summary.averageCalories)} kcal`,
        `${formatNumber(nutritionGoals.calories)} kcal`,
        `${getProgress(summary.averageCalories, nutritionGoals.calories)}%`,
      ],
      [
        "Protein",
        `${formatNumber(summary.averageProtein)} g`,
        `${formatNumber(nutritionGoals.protein)} g`,
        `${getProgress(summary.averageProtein, nutritionGoals.protein)}%`,
      ],
      [
        "Carbohydrates",
        `${formatNumber(summary.averageCarbohydrates)} g`,
        `${formatNumber(nutritionGoals.carbohydrates)} g`,
        `${getProgress(summary.averageCarbohydrates, nutritionGoals.carbohydrates)}%`,
      ],
      [
        "Fat",
        `${formatNumber(summary.averageFat)} g`,
        `${formatNumber(nutritionGoals.fat)} g`,
        `${getProgress(summary.averageFat, nutritionGoals.fat)}%`,
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: 255,
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
  });

  // Page 2: Charts

  doc.addPage();

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Weekly Nutrition Charts", margin, 20);

  const [calorieImage, macroImage] = await Promise.all([
    captureChart(calorieChart),
    captureChart(macroChart),
  ]);

  const chartWidth = 182;
  let chartY = 30;

  if (calorieImage) {
    doc.setFontSize(11);
    doc.text("Calorie Overview", margin, chartY);

    doc.addImage(calorieImage, "PNG", margin, chartY + 5, chartWidth, 82);

    chartY += 105;
  } else {
    doc.setFontSize(9);
    doc.text("Calorie chart could not be captured.", margin, chartY);
    chartY += 15;
  }

  if (macroImage) {
    doc.setFontSize(11);
    doc.text("Macronutrient Overview", margin, chartY);

    doc.addImage(macroImage, "PNG", margin, chartY + 5, chartWidth, 82);
  } else {
    doc.setFontSize(9);
    doc.text("Macronutrient chart could not be captured.", margin, chartY);
  }

  // Page 3: Daily nutrition table

  doc.addPage();

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Daily Nutrition Details", margin, 20);

  autoTable(doc, {
    startY: 28,
    margin: { left: margin, right: margin },
    head: [["Date", "Meals", "Calories", "Protein", "Carbs", "Fat"]],
    body: [
      ...dailyData.map((day) => [
        format(parseISO(day.date), "EEE, d MMM"),
        String(day.mealCount),
        `${formatNumber(day.calories)} kcal`,
        `${formatNumber(day.protein)} g`,
        `${formatNumber(day.carbohydrates)} g`,
        `${formatNumber(day.fat)} g`,
      ]),
      [
        "WEEKLY TOTAL",
        String(dailyData.reduce((total, day) => total + day.mealCount, 0)),
        `${formatNumber(summary.totalCalories)} kcal`,
        `${formatNumber(summary.totalProtein)} g`,
        `${formatNumber(summary.totalCarbohydrates)} g`,
        `${formatNumber(summary.totalFat)} g`,
      ],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [22, 163, 74],
      textColor: 255,
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    didParseCell(data) {
      if (data.row.index === dailyData.length && data.section === "body") {
        data.cell.styles.fontStyle = "bold";
        data.cell.styles.fillColor = [240, 253, 244];
      }
    },
  });

  const pageCount = doc.getNumberOfPages();

  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);

    doc.text(
      `Weekly Nutrition Report | Page ${page} of ${pageCount}`,
      pageWidth / 2,
      290,
      { align: "center" },
    );
  }

  doc.save(`nutrition-report-${startDate}-to-${endDate}.pdf`);
}
