import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useEffect, type Ref } from "react";
import type { DailyNutrition } from "../../../types/analytics";
import { formatNumber } from "../../../utils/analytics";

interface CalorieChartProps {
  dailyData: DailyNutrition[];
  chartRef?: Ref<HTMLDivElement>;
  onReady?: () => void;
}
function CalorieChart({ dailyData, chartRef, onReady }: CalorieChartProps) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <div ref={chartRef}>
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h2 className="font-semibold text-slate-800">Calorie Overview</h2>
          <p className="mt-1 text-sm text-slate-500">
            Daily calorie intake throughout the week
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dailyData}
              margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value) => [
                  `${formatNumber(Number(value ?? 0))} kcal`,
                  "Calories",
                ]}
              />
              <Bar
                dataKey="calories"
                name="Calories"
                fill="#16a34a"
                radius={[5, 5, 0, 0]}
                maxBarSize={42}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default CalorieChart;
