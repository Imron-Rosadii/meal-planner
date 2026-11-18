import type { LucideIcon } from "lucide-react";

import Input from "../atoms/Input";

interface NutritionGoalFieldProps {
  name: string;
  label: string;
  unit: string;
  description: string;
  step: string;
  value: string;
  error?: string;
  disabled?: boolean;
  icon: LucideIcon;
  onChange: (value: string) => void;
}

export default function NutritionGoalField({
  name,
  label,
  unit,
  description,
  step,
  value,
  error,
  disabled = false,
  icon: Icon,
  onChange,
}: NutritionGoalFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <Input
        id={name}
        type="number"
        min="0"
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        error={error}
        disabled={disabled}
        leftIcon={<Icon size={17} />}
        rightIcon={<span className="text-xs font-medium">{unit}</span>}
      />

      <p className="mt-1.5 text-xs text-slate-500">{description}</p>
    </div>
  );
}
