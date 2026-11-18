import { useMemo, useState } from "react";

import DashboardLayout from "../components/templates/DashboardLayout";
import Spinner from "../components/atoms/Spinner";
import ConfirmDialog from "../components/molecules/ConfirmDialog";
import MealForm from "../components/organisms/MealForm";

import MealLibraryHeader from "../components/organisms/meal-library/MealLibraryHeader";
import MealLibraryFilters from "../components/organisms/meal-library/MealLibraryFilters";
import MealLibraryList from "../components/organisms/meal-library/MealLibraryList";
import MealLibraryEmptyState from "../components/organisms/meal-library/MealLibraryEmptyState";

import { useMeals } from "../hooks/useMeals";
import type { CreateMealInput } from "../services/mealService";
import type { Database } from "../types/database.types";

type Meal = Database["public"]["Tables"]["meals"]["Row"];
type MealCategory = Database["public"]["Enums"]["meal_category"];

export default function MealLibraryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showArchived, setShowArchived] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [mealToArchive, setMealToArchive] = useState<Meal | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const [mealToDelete, setMealToDelete] = useState<Meal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [actionError, setActionError] = useState<string | null>(null);

  const { meals, loading, error, addMeal, editMeal, archive, restore, remove } =
    useMeals({
      search,
      category: category === "all" ? undefined : (category as MealCategory),
      includeArchived: showArchived,
    });

  const visibleMeals = useMemo(
    () =>
      meals.filter((meal) =>
        showArchived ? meal.archived_at !== null : meal.archived_at === null,
      ),
    [meals, showArchived],
  );

  const openCreateForm = () => {
    setSelectedMeal(null);
    setActionError(null);
    setIsFormOpen(true);
  };

  const openEditForm = (meal: Meal) => {
    setSelectedMeal(meal);
    setActionError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (isSubmitting) return;

    setIsFormOpen(false);
    setSelectedMeal(null);
    setActionError(null);
  };

  const handleSaveMeal = async (input: CreateMealInput) => {
    setIsSubmitting(true);
    setActionError(null);

    try {
      if (selectedMeal) {
        await editMeal(selectedMeal.id, input);
      } else {
        await addMeal(input);
      }

      setIsFormOpen(false);
      setSelectedMeal(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save meal.";

      setActionError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const openArchiveConfirmation = (meal: Meal) => {
    setActionError(null);
    setMealToArchive(meal);
  };

  const closeArchiveConfirmation = () => {
    if (isArchiving) return;

    setMealToArchive(null);
  };

  const confirmArchive = async () => {
    if (!mealToArchive || isArchiving) return;

    setIsArchiving(true);
    setActionError(null);

    try {
      await archive(mealToArchive.id);
      setMealToArchive(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to archive meal.",
      );
    } finally {
      setIsArchiving(false);
    }
  };

  const handleRestore = async (meal: Meal) => {
    setActionError(null);

    try {
      await restore(meal.id);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to restore meal.",
      );
    }
  };

  const openDeleteConfirmation = (meal: Meal) => {
    setActionError(null);
    setMealToDelete(meal);
  };

  const closeDeleteConfirmation = () => {
    if (isDeleting) return;

    setMealToDelete(null);
  };

  const confirmDelete = async () => {
    if (!mealToDelete || isDeleting) return;

    setIsDeleting(true);
    setActionError(null);

    try {
      await remove(mealToDelete.id);
      setMealToDelete(null);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete meal.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const hasFilters = Boolean(search.trim()) || category !== "all";

  return (
    <DashboardLayout
      title="Meal Library"
      description="Manage your meals and their nutrition information."
    >
      <div className="space-y-6">
        <MealLibraryHeader
          mealCount={visibleMeals.length}
          onAdd={openCreateForm}
        />

        <MealLibraryFilters
          search={search}
          category={category}
          showArchived={showArchived}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onToggleArchived={() => setShowArchived((current) => !current)}
        />

        {actionError && (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {actionError}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Spinner size="lg" label="Loading meals..." />
          </div>
        ) : visibleMeals.length === 0 ? (
          <MealLibraryEmptyState
            showArchived={showArchived}
            hasFilters={hasFilters}
            onAdd={openCreateForm}
          />
        ) : (
          <MealLibraryList
            meals={visibleMeals}
            showArchived={showArchived}
            onEdit={openEditForm}
            onDelete={openDeleteConfirmation}
            onArchive={openArchiveConfirmation}
            onRestore={(meal) => void handleRestore(meal)}
          />
        )}
      </div>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeForm();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="meal-form-title"
            className="my-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="mb-6">
              <h2
                id="meal-form-title"
                className="text-xl font-bold text-slate-900"
              >
                {selectedMeal ? "Edit Meal" : "Add New Meal"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Enter meal details and nutrition information.
              </p>
            </div>

            <MealForm
              key={selectedMeal?.id ?? "new-meal"}
              initialMeal={selectedMeal}
              isSubmitting={isSubmitting}
              onSubmit={handleSaveMeal}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(mealToArchive)}
        title="Archive Meal"
        description={
          mealToArchive
            ? `Are you sure you want to archive "${mealToArchive.name}"? You can restore it later from your archived meals.`
            : ""
        }
        confirmText="Archive"
        cancelText="Cancel"
        isLoading={isArchiving}
        onConfirm={confirmArchive}
        onCancel={closeArchiveConfirmation}
      />

      <ConfirmDialog
        isOpen={Boolean(mealToDelete)}
        title="Delete Meal Permanently"
        description={
          mealToDelete
            ? `Are you sure you want to permanently delete "${mealToDelete.name}"? Existing scheduled meals will remain in your planner. This action cannot be undone.`
            : ""
        }
        confirmText="Delete Permanently"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={confirmDelete}
        onCancel={closeDeleteConfirmation}
      />
    </DashboardLayout>
  );
}
