import { Archive, Pencil, RotateCcw, Trash2 } from "lucide-react";

import Badge from "../../atoms/Badge";
import Button from "../../atoms/Button";
import MealCard from "../../molecules/MealCard";

import type { Database } from "../../../types/database.types";

type Meal = Database["public"]["Tables"]["meals"]["Row"];

interface MealLibraryListProps {
  meals: Meal[];
  showArchived: boolean;
  onEdit: (meal: Meal) => void;
  onArchive: (meal: Meal) => void;
  onRestore: (meal: Meal) => void;
  onDelete: (meal: Meal) => void;
}

export default function MealLibraryList({
  meals,
  showArchived,
  onEdit,
  onArchive,
  onRestore,
  onDelete,
}: MealLibraryListProps) {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {meals.map((meal, index) => (
        <div
          key={meal.id}
          className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
        >
          <MealCard
            isPriority={
              index === meals.findIndex((item) => Boolean(item.image_url))
            }
            meal={{
              id: meal.id,
              name: meal.name,
              description: meal.description ?? "",
              imageUrl: meal.image_url,
              category: meal.category,
              calories: meal.calories,
              protein: meal.protein,
              carbohydrates: meal.carbohydrates,
              fat: meal.fat,
            }}
          />

          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
            {showArchived ? (
              <Badge variant="warning">Archived</Badge>
            ) : (
              <Badge variant="success">Active</Badge>
            )}

            <div className="flex flex-wrap gap-2">
              {showArchived ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRestore(meal)}
                  leftIcon={<RotateCcw size={15} />}
                >
                  Restore
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(meal)}
                    leftIcon={<Pencil size={15} />}
                  >
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onArchive(meal)}
                    leftIcon={<Archive size={15} />}
                  >
                    Archive
                  </Button>
                </>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(meal)}
                leftIcon={<Trash2 size={15} />}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
