import { Search, X } from "lucide-react";
import type { InputHTMLAttributes } from "react";

import Input from "../atoms/Input";

interface SearchInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  onClear?: () => void;
}

function SearchInput({
  onClear,
  value,
  defaultValue,
  className = "",
  ...props
}: SearchInputProps) {
  const hasValue = String(value ?? defaultValue ?? "").length > 0;

  return (
    <div className={`w-full ${className}`}>
      <Input
        {...props}
        type="search"
        value={value}
        defaultValue={defaultValue}
        placeholder={props.placeholder ?? "Search meals..."}
        leftIcon={<Search size={18} />}
        rightIcon={
          hasValue && onClear ? (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              className="rounded p-0.5 hover:bg-slate-100"
            >
              <X size={16} />
            </button>
          ) : undefined
        }
      />
    </div>
  );
}

export default SearchInput;
