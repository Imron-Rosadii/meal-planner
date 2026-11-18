import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

const WeeklyCalorieChart = lazy(() => import("./WeeklyCalorieChart"));

interface WeeklySummaryItem {
  date: string;
  calories: number;
}

interface WeeklyCalorieOverviewProps {
  weekStart: Date;
  weekEnd: Date;
  totalCalories: number;
  weeklySummary: WeeklySummaryItem[];
}

export default function WeeklyCalorieOverview({
  weekStart,
  weekEnd,
  totalCalories,
  weeklySummary,
}: WeeklyCalorieOverviewProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [shouldLoadChart, setShouldLoadChart] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (shouldLoadChart) return;

    const element = chartContainerRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadChart(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [shouldLoadChart]);

  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays size={20} className="text-emerald-600" />
            <h2 className="font-semibold text-slate-800">
              Weekly Calorie Overview
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {format(weekStart, "dd MMM")} – {format(weekEnd, "dd MMM yyyy")}
          </p>
        </div>

        <div className="sm:text-right">
          <p className="text-sm text-slate-500">Total this week</p>
          <p className="text-xl font-bold text-slate-900">
            {Math.round(totalCalories).toLocaleString("en-US")}{" "}
            <span className="text-sm font-normal text-slate-500">kcal</span>
          </p>
        </div>
      </div>

      <div ref={chartContainerRef} className="min-h-64">
        {shouldLoadChart ? (
          <Suspense
            fallback={
              <div className="h-64 animate-pulse rounded-xl bg-slate-50" />
            }
          >
            <WeeklyCalorieChart weeklySummary={weeklySummary} />
          </Suspense>
        ) : (
          <div
            aria-hidden="true"
            className="h-64 animate-pulse rounded-xl bg-slate-50"
          />
        )}
      </div>
    </section>
  );
}
