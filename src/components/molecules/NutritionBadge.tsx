import Badge from "../atoms/Badge";

type NutritionType = "calories" | "protein" | "carbohydrates" | "fat";

interface NutritionBadgeProps {
  type: NutritionType;
  value: number;
  className?: string;
}

const nutritionConfig: Record<
  NutritionType,
  {
    label: string;
    unit: string;
    variant: "success" | "info" | "warning" | "purple";
  }
> = {
  calories: {
    label: "Calories",
    unit: "kcal",
    variant: "warning",
  },
  protein: {
    label: "Protein",
    unit: "g",
    variant: "success",
  },
  carbohydrates: {
    label: "Carbs",
    unit: "g",
    variant: "info",
  },
  fat: {
    label: "Fat",
    unit: "g",
    variant: "purple",
  },
};

function NutritionBadge({ type, value, className = "" }: NutritionBadgeProps) {
  const config = nutritionConfig[type];

  return (
    <Badge variant={config.variant} size="sm" className={className}>
      {config.label}: {value} {config.unit}
    </Badge>
  );
}

export default NutritionBadge;
