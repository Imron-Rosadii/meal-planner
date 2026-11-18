import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputClasses = [
      "h-11 rounded-lg border bg-white px-3 text-sm text-slate-800",
      "placeholder:text-slate-400",
      "transition-colors duration-200",
      "focus:outline-none focus:ring-2",
      "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
      error
        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
        : "border-slate-300 focus:border-pink-500 focus:ring-pink-100",
      leftIcon ? "pl-10" : "",
      rightIcon ? "pr-10" : "",
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={fullWidth ? "w-full" : "w-fit"}>
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 text-slate-400">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            disabled={disabled}
            className={inputClasses}
            aria-invalid={Boolean(error)}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3 flex items-center text-slate-400">
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
