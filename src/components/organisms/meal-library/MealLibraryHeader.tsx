import { Plus } from "lucide-react";

import Button from "../../atoms/Button";

interface MealLibraryHeaderProps {
  mealCount: number;
  onAdd: () => void;
}

export default function MealLibraryHeader({
  mealCount,
  onAdd,
}: MealLibraryHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Your Meals</h2>
        <p className="mt-1 text-sm text-slate-500">
          {mealCount} {mealCount === 1 ? "meal" : "meals"} found
        </p>
      </div>

      <Button onClick={onAdd} leftIcon={<Plus size={18} />}>
        Add New Meal
      </Button>
    </div>
  );
}
