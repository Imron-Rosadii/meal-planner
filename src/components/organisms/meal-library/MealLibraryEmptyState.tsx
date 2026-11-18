import { Plus, Utensils } from "lucide-react";

import Button from "../../atoms/Button";

interface MealLibraryEmptyStateProps {
  showArchived: boolean;
  hasFilters: boolean;
  onAdd: () => void;
}

export default function MealLibraryEmptyState({
  showArchived,
  hasFilters,
  onAdd,
}: MealLibraryEmptyStateProps) {
  const title = showArchived ? "No archived meals" : "No meals found";

  const description = showArchived
    ? "Archived meals will appear here."
    : hasFilters
      ? "Try changing your search or category filter."
      : "Start building your meal library by adding your first meal.";

  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-50 text-pink-600">
        <Utensils size={26} />
      </div>

      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>

      <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>

      {!showArchived && !hasFilters && (
        <Button className="mt-5" onClick={onAdd} leftIcon={<Plus size={18} />}>
          Add Your First Meal
        </Button>
      )}
    </div>
  );
}
