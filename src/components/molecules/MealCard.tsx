import { useState } from "react";
import { Clock, Utensils } from "lucide-react";

import Badge from "../atoms/Badge";
import NutritionBadge from "./NutritionBadge";

type MealCategory = "high-protein" | "low-calorie" | "vegetables" | "general";

interface MealCardProps {
  meal: {
    id: string;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    category: MealCategory;
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    mealType?: string;
  };
  onClick?: () => void;
  className?: string;
  isPriority?: boolean;
}

const categoryConfig: Record<
  MealCategory,
  {
    label: string;
    variant: "success" | "info" | "warning" | "default";
  }
> = {
  "high-protein": {
    label: "High Protein",
    variant: "success",
  },
  "low-calorie": {
    label: "Low Calorie",
    variant: "info",
  },
  vegetables: {
    label: "Vegetables",
    variant: "success",
  },
  general: {
    label: "General",
    variant: "default",
  },
};

function MealCard({
  meal,
  onClick,
  className = "",
  isPriority = false,
}: MealCardProps) {
  const category = categoryConfig[meal.category];
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  const imageError = failedImageUrl === meal.imageUrl;

  return (
    <article
      onClick={onClick}
      onKeyDown={(event) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`
        rounded-xl border border-slate-200 bg-white p-4
        shadow-sm transition-shadow
        ${onClick ? "cursor-pointer hover:shadow-md" : ""}
        ${className}
      `}
    >
      <div className="-mx-4 -mt-4 mb-4 overflow-hidden rounded-t-xl">
        {meal.imageUrl && !imageError ? (
          <img
            src={meal.imageUrl}
            alt={meal.name}
            width={1200}
            height={675}
            loading={isPriority ? "eager" : "lazy"}
            fetchPriority={isPriority ? "high" : "auto"}
            decoding="async"
            onError={() => setFailedImageUrl(meal.imageUrl ?? null)}
            className="aspect-video w-full object-cover"
          />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-pink-50 text-pink-500">
            <Utensils size={40} />
          </div>
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-800">{meal.name}</h3>

          {meal.description && (
            <p className="mt-1 text-sm text-slate-500">{meal.description}</p>
          )}
        </div>

        <Badge variant={category.variant} size="sm">
          {category.label}
        </Badge>
      </div>

      {meal.mealType && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <Clock size={14} />
          <span className="capitalize">{meal.mealType}</span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <NutritionBadge type="calories" value={meal.calories} />
        <NutritionBadge type="protein" value={meal.protein} />
        <NutritionBadge type="carbohydrates" value={meal.carbohydrates} />
        <NutritionBadge type="fat" value={meal.fat} />
      </div>
    </article>
  );
}

export default MealCard;
