import { lazy, Suspense } from "react";

import DashboardLayout from "../components/templates/DashboardLayout";
import Spinner from "../components/atoms/Spinner";

const AnalyticsContent = lazy(
  () => import("../components/organisms/analytics/AnalyticsContent"),
);

function AnalyticsPage() {
  return (
    <DashboardLayout
      title="Analytics"
      description="Track your nutrition trends and understand your eating habits."
    >
      <Suspense
        fallback={
          <div
            className="flex min-h-64 items-center justify-center rounded-xl border border-slate-200 bg-white"
            aria-label="Loading analytics"
          >
            <Spinner size="lg" label="Loading analytics content..." />
          </div>
        }
      >
        <AnalyticsContent />
      </Suspense>
    </DashboardLayout>
  );
}

export default AnalyticsPage;
