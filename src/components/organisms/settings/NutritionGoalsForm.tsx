import { useState, type FormEvent } from "react";
import {
  Activity,
  CheckCircle2,
  Flame,
  Save,
  Target,
  Utensils,
} from "lucide-react";

import Button from "../../atoms/Button";
import NutritionGoalField from "../../molecules/NutritionGoalField";

import type { UpdateNutritionGoalsInput } from "../../../services/nutritionGoalService";

interface FormValues {
  calories_goal: string;
  protein_goal: string;
  carbohydrates_goal: string;
  fat_goal: string;
}

type GoalField = keyof FormValues;

interface NutritionGoalsFormProps {
  initialGoals: UpdateNutritionGoalsInput;
  saving: boolean;
  onSave: (values: UpdateNutritionGoalsInput) => Promise<unknown>;
}

const GOAL_FIELDS: {
  name: GoalField;
  label: string;
  unit: string;
  description: string;
  icon: typeof Flame;
  step: string;
}[] = [
  {
    name: "calories_goal",
    label: "Daily Calories",
    unit: "kcal",
    description: "Your daily energy intake target.",
    icon: Flame,
    step: "1",
  },
  {
    name: "protein_goal",
    label: "Protein",
    unit: "g",
    description: "Daily protein intake target.",
    icon: Activity,
    step: "0.1",
  },
  {
    name: "carbohydrates_goal",
    label: "Carbohydrates",
    unit: "g",
    description: "Daily carbohydrate intake target.",
    icon: Utensils,
    step: "0.1",
  },
  {
    name: "fat_goal",
    label: "Fat",
    unit: "g",
    description: "Daily fat intake target.",
    icon: Target,
    step: "0.1",
  },
];

export default function NutritionGoalsForm({
  initialGoals,
  saving,
  onSave,
}: NutritionGoalsFormProps) {
  const [formValues, setFormValues] = useState<FormValues>(() => ({
    calories_goal: String(initialGoals.calories_goal),
    protein_goal: String(initialGoals.protein_goal),
    carbohydrates_goal: String(initialGoals.carbohydrates_goal),
    fat_goal: String(initialGoals.fat_goal),
  }));

  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<GoalField, string>>
  >({});

  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleChange = (field: GoalField, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));

    setValidationErrors((current) => ({
      ...current,
      [field]: undefined,
    }));

    setSuccessMessage("");
    setSubmitError("");
  };

  const validateForm = (): UpdateNutritionGoalsInput | null => {
    const errors: Partial<Record<GoalField, string>> = {};

    const values: Record<GoalField, number> = {
      calories_goal: Number(formValues.calories_goal),
      protein_goal: Number(formValues.protein_goal),
      carbohydrates_goal: Number(formValues.carbohydrates_goal),
      fat_goal: Number(formValues.fat_goal),
    };

    for (const field of Object.keys(values) as GoalField[]) {
      const value = formValues[field].trim();

      if (!value) {
        errors[field] = "This field is required.";
      } else if (!Number.isFinite(values[field]) || values[field] <= 0) {
        errors[field] = "Enter a number greater than zero.";
      }
    }

    if (!errors.calories_goal && !Number.isInteger(values.calories_goal)) {
      errors.calories_goal = "Calories must be a whole number.";
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) {
      return null;
    }

    return values;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSuccessMessage("");
    setSubmitError("");

    const values = validateForm();

    if (!values) return;

    try {
      await onSave(values);
      setSuccessMessage("Your nutrition goals have been saved successfully.");
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Failed to save nutrition goals. Please try again.",
      );
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex items-start gap-3">
        <div className="rounded-xl bg-pink-50 p-3 text-pink-600">
          <Target size={22} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Daily Nutrition Goals
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Customize your daily nutrition targets. These values will be used in
            your Dashboard and Analytics.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          {GOAL_FIELDS.map((field) => (
            <NutritionGoalField
              key={field.name}
              {...field}
              value={formValues[field.name]}
              error={validationErrors[field.name]}
              disabled={saving}
              onChange={(value) => handleChange(field.name, value)}
            />
          ))}
        </div>

        {successMessage && (
          <div
            className="mt-6 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
            role="status"
          >
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {submitError && (
          <div
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            role="alert"
          >
            {submitError}
          </div>
        )}

        <div className="mt-8 flex justify-end border-t border-slate-100 pt-5">
          <Button
            type="submit"
            isLoading={saving}
            leftIcon={<Save size={17} />}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </section>
  );
}
