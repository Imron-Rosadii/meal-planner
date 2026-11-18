import DashboardLayout from "../components/templates/DashboardLayout";
import NutritionSummary from "../components/organisms/NutritionSummary";
import WeeklyCalendar from "../components/organisms/WeeklyCalendar";
import WeeklyCalorieOverview from "../components/organisms/dashboard/WeeklyCalorieOverview";
import DailyMealActivity from "../components/organisms/dashboard/DailyMealActivity";
import Spinner from "../components/atoms/Spinner";

import { useDashboard } from "../hooks/useDashboard";

function DashboardPage() {
  const {
    selectedDate,
    setSelectedDate,
    weekStart,
    weekEnd,
    dailySchedules,
    dailyNutrition,
    weeklyNutrition,
    weeklySummary,
    goals,
    schedulesLoading,
    goalsLoading,
    error,
    goalsError,
  } = useDashboard();

  return (
    <DashboardLayout
      title="Dashboard"
      description="Overview of your meal planning and daily nutrition."
    >
      <div className="space-y-6">
        <WeeklyCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {schedulesLoading ? (
          <div className="flex min-h-48 items-center justify-center rounded-2xl border border-slate-100 bg-white">
            <Spinner size="lg" label="Loading meal schedules..." />
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-600"
          >
            Unable to load your meal schedules: {error}
          </div>
        ) : (
          <>
            {goalsLoading ? (
              <div className="flex min-h-48 items-center justify-center rounded-2xl border border-slate-100 bg-white">
                <Spinner size="lg" label="Loading nutrition goals..." />
              </div>
            ) : goalsError ? (
              <div
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-600"
              >
                Unable to load your nutrition goals: {goalsError}
              </div>
            ) : (
              <NutritionSummary
                calories={dailyNutrition.calories}
                protein={dailyNutrition.protein}
                carbohydrates={dailyNutrition.carbohydrates}
                fat={dailyNutrition.fat}
                calorieGoal={goals?.calories_goal ?? 2000}
                proteinGoal={goals?.protein_goal ?? 125}
                carbohydratesGoal={goals?.carbohydrates_goal ?? 250}
                fatGoal={goals?.fat_goal ?? 56}
              />
            )}

            <WeeklyCalorieOverview
              weekStart={weekStart}
              weekEnd={weekEnd}
              totalCalories={weeklyNutrition.calories}
              weeklySummary={weeklySummary}
            />

            <DailyMealActivity
              selectedDate={selectedDate}
              dailySchedules={dailySchedules}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
