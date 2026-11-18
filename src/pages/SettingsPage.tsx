import DashboardLayout from "../components/templates/DashboardLayout";
import Button from "../components/atoms/Button";

import NutritionGoalsForm from "../components/organisms/settings/NutritionGoalsForm";
import NutritionGoalsInfo from "../components/organisms/settings/NutritionGoalsInfo";
import Spinner from "../components/atoms/Spinner";

import { useNutritionGoals } from "../hooks/useNutritionGoals";

function SettingsPage() {
  const { goals, loading, saving, error, saveGoals } = useNutritionGoals();

  if (loading) {
    return (
      <DashboardLayout
        title="Settings"
        description="Manage your personal nutrition targets."
      >
        <div className="flex min-h-64 items-center justify-center">
          <Spinner size="lg" label="Loading your nutrition goals..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error && !goals) {
    return (
      <DashboardLayout
        title="Settings"
        description="Manage your personal nutrition targets."
      >
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-700">
            Unable to load nutrition goals
          </p>

          <p className="mt-1 text-sm text-red-600">{error}</p>

          <Button
            className="mt-4"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Try again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Settings"
      description="Manage your personal nutrition targets and daily goals."
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {goals && (
          <NutritionGoalsForm
            initialGoals={{
              calories_goal: goals.calories_goal,
              protein_goal: goals.protein_goal,
              carbohydrates_goal: goals.carbohydrates_goal,
              fat_goal: goals.fat_goal,
            }}
            saving={saving}
            onSave={saveGoals}
          />
        )}

        <NutritionGoalsInfo />
      </div>
    </DashboardLayout>
  );
}

export default SettingsPage;
