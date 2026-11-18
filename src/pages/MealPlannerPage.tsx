import DashboardLayout from "../components/templates/DashboardLayout";
import WeeklyCalendar from "../components/organisms/WeeklyCalendar";

import DailyNutritionCards from "../components/organisms/meal-planner/DailyNutritionCards";
import DailyScheduleSection from "../components/organisms/meal-planner/DailyScheduleSection";
import MealScheduleModal from "../components/organisms/meal-planner/MealScheduleModal";
import ConfirmDialog from "../components/molecules/ConfirmDialog";

import { useMealPlanner } from "../hooks/useMealPlanner";

export default function MealPlannerPage() {
  const {
    selectedDate,
    setSelectedDate,
    selectedDateString,
    meals,
    selectedSchedules,
    nutrition,
    isLoading,
    pageError,
    isFormOpen,
    selectedSchedule,
    isSubmitting,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSaveSchedule,
    scheduleToDelete,
    isDeleting,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    confirmDeleteSchedule,
  } = useMealPlanner();

  return (
    <DashboardLayout
      title="Meal Planner"
      description="Plan your meals and track your daily nutrition."
    >
      <div className="space-y-6">
        <WeeklyCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        <DailyNutritionCards nutrition={nutrition} />

        <DailyScheduleSection
          selectedDate={selectedDate}
          schedules={selectedSchedules}
          isLoading={isLoading}
          error={pageError}
          onAdd={openCreateForm}
          onEdit={openEditForm}
          onDelete={openDeleteConfirmation}
        />
      </div>

      {isFormOpen && (
        <MealScheduleModal
          meals={meals}
          selectedDate={selectedDateString}
          selectedSchedule={selectedSchedule}
          isSubmitting={isSubmitting}
          onSubmit={handleSaveSchedule}
          onCancel={closeForm}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(scheduleToDelete)}
        title="Delete Meal Schedule"
        description={
          scheduleToDelete
            ? `Are you sure you want to remove "${scheduleToDelete.meal_name}" from your planner? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={confirmDeleteSchedule}
        onCancel={closeDeleteConfirmation}
      />
    </DashboardLayout>
  );
}
