import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { addWeeks, endOfWeek, format, startOfWeek } from "date-fns";

import AnalyticsHeader from "./AnalyticsHeader";
import WeeklySummary from "./WeeklySummary";
import NutritionGoalsComparison from "./NutritionGoalsComparison";
import MacroDistribution from "./MacroDistribution";
import NutritionInsights from "./NutritionInsights";
import DailyNutritionTable from "./DailyNutritionTable";

import Spinner from "../../atoms/Spinner";

import { useAnalytics } from "../../../hooks/useAnalytics";
import { exportAnalyticsCsv } from "../../../utils/exportAnalyticsCsv";

const CalorieChart = lazy(() => import("./CalorieChart"));

const MacronutrientChart = lazy(() => import("./MacronutrientChart"));

function AnalyticsContent() {
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  const calorieChartRef = useRef<HTMLDivElement>(null);
  const macroChartRef = useRef<HTMLDivElement>(null);

  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [shouldLoadCharts, setShouldLoadCharts] = useState(false);

  const chartSectionRef = useRef<HTMLDivElement>(null);
  const chartReadyCountRef = useRef(0);

  const [chartsReady] = useState(() => {
    let resolve!: () => void;

    const promise = new Promise<void>((resolvePromise) => {
      resolve = resolvePromise;
    });

    return {
      promise,
      resolve,
    };
  });

  const handleChartReady = useCallback(() => {
    chartReadyCountRef.current += 1;

    if (chartReadyCountRef.current >= 2) {
      chartsReady.resolve();
    }
  }, [chartsReady]);

  const weekStart = startOfWeek(selectedWeek, {
    weekStartsOn: 1,
  });

  const weekEnd = endOfWeek(selectedWeek, {
    weekStartsOn: 1,
  });

  const startDate = format(weekStart, "yyyy-MM-dd");
  const endDate = format(weekEnd, "yyyy-MM-dd");

  const {
    dailyData,
    summary,
    nutritionGoals,
    macroDistribution,
    totalMacroCalories,
    hasData,
    isPageLoading,
    pageError,
  } = useAnalytics(startDate, endDate);

  useEffect(() => {
    if (!hasData || isPageLoading || pageError || shouldLoadCharts) {
      return;
    }

    const target = chartSectionRef.current;

    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoadCharts(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "0px",
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasData, isPageLoading, pageError, shouldLoadCharts]);

  const handlePreviousWeek = () => {
    setSelectedWeek((current) => addWeeks(current, -1));
  };

  const handleCurrentWeek = () => {
    setSelectedWeek(new Date());
  };

  const handleNextWeek = () => {
    setSelectedWeek((current) => addWeeks(current, 1));
  };

  const handleExport = () => {
    exportAnalyticsCsv(dailyData, summary, startDate, endDate);
  };

  const handleExportPdf = async () => {
    if (!hasData || isPageLoading || pageError || isExportingPdf) {
      return;
    }

    setIsExportingPdf(true);

    try {
      if (!shouldLoadCharts) {
        setShouldLoadCharts(true);
      }

      await chartsReady.promise;

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
      });

      const { exportAnalyticsPdf } =
        await import("../../../utils/exportAnalyticsPdf");

      await exportAnalyticsPdf({
        dailyData,
        summary,
        nutritionGoals,
        startDate,
        endDate,
        calorieChart: calorieChartRef.current,
        macroChart: macroChartRef.current,
      });
    } catch (error) {
      console.error("Failed to export PDF:", error);
      window.alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      <AnalyticsHeader
        weekStart={weekStart}
        weekEnd={weekEnd}
        onPreviousWeek={handlePreviousWeek}
        onCurrentWeek={handleCurrentWeek}
        onNextWeek={handleNextWeek}
        onExport={handleExport}
        onExportPdf={handleExportPdf}
        isExportingPdf={isExportingPdf}
        canExport={hasData && !isPageLoading && !pageError}
      />

      {isPageLoading && (
        <div
          className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-white"
          aria-label="Loading analytics"
        >
          <Spinner size="lg" label="Loading nutrition analytics..." />
        </div>
      )}

      {!isPageLoading && pageError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">
            Failed to load analytics: {pageError}
          </p>
        </div>
      )}

      {!isPageLoading && !pageError && (
        <>
          <WeeklySummary summary={summary} />

          {hasData ? (
            <>
              <NutritionGoalsComparison
                summary={summary}
                goals={nutritionGoals}
              />

              <div
                ref={chartSectionRef}
                className="grid grid-cols-1 gap-6 xl:grid-cols-2"
              >
                {shouldLoadCharts ? (
                  <Suspense
                    fallback={
                      <>
                        <div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-white" />
                        <div className="h-96 animate-pulse rounded-xl border border-slate-200 bg-white" />
                      </>
                    }
                  >
                    <CalorieChart
                      dailyData={dailyData}
                      chartRef={calorieChartRef}
                      onReady={handleChartReady}
                    />

                    <MacronutrientChart
                      dailyData={dailyData}
                      chartRef={macroChartRef}
                      onReady={handleChartReady}
                    />
                  </Suspense>
                ) : (
                  <>
                    <div className="h-96 rounded-xl border border-slate-200 bg-white" />
                    <div className="h-96 rounded-xl border border-slate-200 bg-white" />
                  </>
                )}
              </div>

              <MacroDistribution
                macroDistribution={macroDistribution}
                totalMacroCalories={totalMacroCalories}
              />

              <NutritionInsights summary={summary} />

              <DailyNutritionTable dailyData={dailyData} />
            </>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <h2 className="font-semibold text-slate-800">
                No Nutrition Data
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                No meals have been recorded for this week. Start planning your
                meals to see your nutrition analytics.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AnalyticsContent;
