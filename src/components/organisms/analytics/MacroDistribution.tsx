import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { MacroDistributionItem } from "../../../types/analytics";
import { formatNumber } from "../../../utils/analytics";

interface MacroDistributionProps {
  macroDistribution: MacroDistributionItem[];
  totalMacroCalories: number;
}

function MacroDistribution({
  macroDistribution,
  totalMacroCalories,
}: MacroDistributionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-5">
        <h2 className="font-semibold text-slate-800">Macro Distribution</h2>
        <p className="mt-1 text-sm text-slate-500">
          Weekly energy contribution from each macronutrient
        </p>
      </div>

      {totalMacroCalories > 0 ? (
        <>
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {macroDistribution.map((macro) => (
                      <Cell key={macro.name} fill={macro.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `${formatNumber(Number(value ?? 0))} kcal`,
                      "Energy",
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
              {macroDistribution.map((macro) => {
                const percentage = (macro.value / totalMacroCalories) * 100;

                return (
                  <div
                    key={macro.name}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: macro.color }}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {macro.name}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-800">
                        {percentage.toFixed(1)}%
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatNumber(macro.value)} kcal
                      </p>
                    </div>
                  </div>
                );
              })}

              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-500">
                  Total energy from macros
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {formatNumber(totalMacroCalories)} kcal
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-400">
            Calculated using 4 kcal/g for protein and carbohydrates, and 9
            kcal/g for fat.
          </p>
        </>
      ) : (
        <p className="py-12 text-center text-sm text-slate-400">
          No macronutrient data available for this week.
        </p>
      )}
    </section>
  );
}

export default MacroDistribution;
