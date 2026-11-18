import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useEffect, type Ref } from "react";
import type { DailyNutrition } from "../../../types/analytics";
import { formatNumber } from "../../../utils/analytics";

interface MacronutrientChartProps {
  dailyData: DailyNutrition[];
  chartRef?: Ref<HTMLDivElement>;
  onReady?: () => void;
}

function MacronutrientChart({
  dailyData,
  chartRef,
  onReady,
}: MacronutrientChartProps) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return (
    <div ref={chartRef}>
      <section className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-5">
          <h2 className="font-semibold text-slate-800">
            Macronutrient Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Daily protein, carbohydrates, and fat
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
                formatter={(value) => `${formatNumber(Number(value ?? 0))} g`}
              />
              <Legend />
              <Bar
                dataKey="protein"
                name="Protein"
                stackId="macros"
                fill="#16a34a"
              />
              <Bar
                dataKey="carbohydrates"
                name="Carbs"
                stackId="macros"
                fill="#3b82f6"
              />
              <Bar
                dataKey="fat"
                name="Fat"
                stackId="macros"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default MacronutrientChart;
