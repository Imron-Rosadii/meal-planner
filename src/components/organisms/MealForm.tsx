import { useState, type FormEvent } from "react";

import Button from "../atoms/Button";
import Input from "../atoms/Input";
import FormField from "../molecules/FormField";

import type { CreateMealInput } from "../../services/mealService";
import type { Database } from "../../types/database.types";

type Meal = Database["public"]["Tables"]["meals"]["Row"];
type MealCategory = Database["public"]["Enums"]["meal_category"];

interface MealFormProps {
  initialMeal?: Meal | null;
  isSubmitting?: boolean;
  onSubmit: (input: CreateMealInput) => Promise<void>;
  onCancel: () => void;
}

interface MealFormValues {
  name: string;
  description: string;
  imageUrl: string;
  category: MealCategory;
  calories: string;
  protein: string;
  carbohydrates: string;
  fat: string;
}

const initialValues: MealFormValues = {
  name: "",
  description: "",
  imageUrl: "",
  category: "general",
  calories: "",
  protein: "",
  carbohydrates: "",
  fat: "",
};

const categories: { value: MealCategory; label: string }[] = [
  { value: "high-protein", label: "High Protein" },
  { value: "low-calorie", label: "Low Calorie" },
  { value: "vegetables", label: "Vegetables & Fiber" },
  { value: "general", label: "General" },
];

export default function MealForm({
  initialMeal,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: MealFormProps) {
  const [values, setValues] = useState<MealFormValues>(() => {
    if (!initialMeal) return initialValues;

    return {
      name: initialMeal.name,
      description: initialMeal.description ?? "",
      imageUrl: initialMeal.image_url ?? "",
      category: initialMeal.category,
      calories: String(initialMeal.calories),
      protein: String(initialMeal.protein),
      carbohydrates: String(initialMeal.carbohydrates),
      fat: String(initialMeal.fat),
    };
  });

  const [error, setError] = useState<string | null>(null);

  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);

  const imageError = failedImageUrl === values.imageUrl.trim();

  const updateField = <K extends keyof MealFormValues>(
    field: K,
    value: MealFormValues[K],
  ) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const nutritionValues = [
      values.calories,
      values.protein,
      values.carbohydrates,
      values.fat,
    ];

    if (nutritionValues.some((value) => value.trim() === "")) {
      setError("Please complete all nutrition fields.");
      return;
    }

    const numbers = nutritionValues.map(Number);

    if (numbers.some((value) => !Number.isFinite(value) || value < 0)) {
      setError("Nutrition values must be valid non-negative numbers.");
      return;
    }

    const imageUrl = values.imageUrl.trim();

    if (imageUrl) {
      try {
        const parsedUrl = new URL(imageUrl);

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error("Invalid image URL.");
        }
      } catch {
        setError("Please enter a valid HTTP or HTTPS image URL.");
        return;
      }
    }

    try {
      await onSubmit({
        name: values.name.trim(),
        description: values.description.trim() || null,
        image_url: imageUrl || null,
        category: values.category,
        calories: Number(values.calories),
        protein: Number(values.protein),
        carbohydrates: Number(values.carbohydrates),
        fat: Number(values.fat),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save meal.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FormField label="Meal Name" htmlFor="meal-name" required>
        <Input
          id="meal-name"
          value={values.name}
          onChange={(event) => updateField("name", event.target.value)}
          placeholder="e.g. Grilled Chicken Breast"
          required
          maxLength={100}
        />
      </FormField>

      <FormField label="Description" htmlFor="meal-description">
        <textarea
          id="meal-description"
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Describe your meal..."
          rows={3}
          maxLength={500}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </FormField>

      <FormField label="Image URL" htmlFor="meal-image-url">
        <Input
          id="meal-image-url"
          type="url"
          value={values.imageUrl}
          onChange={(event) => updateField("imageUrl", event.target.value)}
          placeholder="https://example.com/meal-image.jpg"
        />
        <p className="mt-1 text-xs text-slate-500">
          Enter a direct image URL. Leave empty to use the default meal icon.
        </p>

        {values.imageUrl.trim() && (
          <div className="mt-3">
            {imageError ? (
              <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
                Unable to load image. Please check the image URL.
              </p>
            ) : (
              <img
                src={values.imageUrl.trim()}
                alt="Meal preview"
                onError={() => setFailedImageUrl(values.imageUrl.trim())}
                className="h-40 w-full rounded-xl border border-slate-200 object-cover"
              />
            )}
          </div>
        )}
      </FormField>

      <FormField label="Category" htmlFor="meal-category" required>
        <select
          id="meal-category"
          value={values.category}
          onChange={(event) =>
            updateField("category", event.target.value as MealCategory)
          }
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </FormField>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-slate-800">
          Nutrition Information
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Calories (kcal)" htmlFor="meal-calories" required>
            <Input
              id="meal-calories"
              type="number"
              min="0"
              step="1"
              value={values.calories}
              onChange={(event) => updateField("calories", event.target.value)}
              placeholder="0"
              required
            />
          </FormField>

          <FormField label="Protein (g)" htmlFor="meal-protein" required>
            <Input
              id="meal-protein"
              type="number"
              min="0"
              step="0.1"
              value={values.protein}
              onChange={(event) => updateField("protein", event.target.value)}
              placeholder="0"
              required
            />
          </FormField>

          <FormField label="Carbohydrates (g)" htmlFor="meal-carbs" required>
            <Input
              id="meal-carbs"
              type="number"
              min="0"
              step="0.1"
              value={values.carbohydrates}
              onChange={(event) =>
                updateField("carbohydrates", event.target.value)
              }
              placeholder="0"
              required
            />
          </FormField>

          <FormField label="Fat (g)" htmlFor="meal-fat" required>
            <Input
              id="meal-fat"
              type="number"
              min="0"
              step="0.1"
              value={values.fat}
              onChange={(event) => updateField("fat", event.target.value)}
              placeholder="0"
              required
            />
          </FormField>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" isLoading={isSubmitting}>
          {initialMeal ? "Save Changes" : "Add Meal"}
        </Button>
      </div>
    </form>
  );
}
