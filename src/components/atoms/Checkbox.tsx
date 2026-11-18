import type { InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
}

function Checkbox({ label, className = "", id, ...props }: CheckboxProps) {
  return (
    <label
      className={`inline-flex items-center gap-2 cursor-pointer ${className}`}
    >
      <input
        {...props}
        id={id}
        type="checkbox"
        className="
          h-4 w-4 shrink-0 cursor-pointer rounded
          border-slate-300 text-pink-600
          accent-pink-600
          focus:ring-2 focus:ring-pink-500 focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
        "
      />

      {label && <span className="text-sm text-slate-700">{label}</span>}
    </label>
  );
}

export default Checkbox;
