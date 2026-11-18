interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "pink" | "white" | "slate";
  label?: string;
  className?: string;
}

const sizeStyles = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-[3px]",
  lg: "h-10 w-10 border-4",
};

const colorStyles = {
  pink: "border-pink-600/20 border-t-pink-600",
  white: "border-white/30 border-t-white",
  slate: "border-slate-300 border-t-slate-700",
};

function Spinner({
  size = "md",
  color = "pink",
  label,
  className = "",
}: SpinnerProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={`
          inline-block shrink-0 animate-spin rounded-full
          ${sizeStyles[size]}
          ${colorStyles[color]}
        `}
        aria-hidden="true"
      />

      {label && <span className="text-sm text-slate-600">{label}</span>}

      {!label && <span className="sr-only">Loading...</span>}
    </div>
  );
}

export default Spinner;
