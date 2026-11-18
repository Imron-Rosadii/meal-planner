import { Activity } from "lucide-react";

export default function NutritionGoalsInfo() {
  return (
    <section className="rounded-xl border border-blue-100 bg-blue-50/70 p-5">
      <div className="flex items-start gap-3">
        <Activity className="mt-0.5 shrink-0 text-blue-600" size={20} />

        <div>
          <h3 className="font-medium text-slate-800">
            About your nutrition goals
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Your goals are personal reference targets. Your Dashboard and
            Analytics will compare your recorded nutrition intake against these
            values. You can update them whenever your needs change.
          </p>
        </div>
      </div>
    </section>
  );
}
