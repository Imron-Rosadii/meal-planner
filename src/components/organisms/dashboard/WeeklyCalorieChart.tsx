import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WeeklySummaryItem {
  date: string;
  calories: number;
}

interface WeeklyCalorieChartProps {
  weeklySummary: WeeklySummaryItem[];
}

export default function WeeklyCalorieChart({
  weeklySummary,
}: WeeklyCalorieChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={weeklySummary}
          margin={{
            top: 10,
            right: 10,
            left: -15,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value: number) => value.toLocaleString("en-US")}
          />

          <Tooltip
            formatter={(value) => [
              `${Number(value).toLocaleString("en-US")} kcal`,
              "Calories",
            ]}
            labelFormatter={(label) => label}
          />

          <Bar
            dataKey="calories"
            name="Calories"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
