import { Archive, RotateCcw } from "lucide-react";

import Button from "../../atoms/Button";
import SearchInput from "../../molecules/SearchInput";

interface MealLibraryFiltersProps {
  search: string;
  category: string;
  showArchived: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onToggleArchived: () => void;
}

const categoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "high-protein", label: "High Protein" },
  { value: "low-calorie", label: "Low Calorie" },
  { value: "vegetables", label: "Vegetables & Fiber" },
  { value: "general", label: "General" },
];

export default function MealLibraryFilters({
  search,
  category,
  showArchived,
  onSearchChange,
  onCategoryChange,
  onToggleArchived,
}: MealLibraryFiltersProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:flex-row">
      <div className="min-w-0 flex-1">
        <SearchInput
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onClear={() => onSearchChange("")}
          placeholder="Search meals by name..."
        />
      </div>

      <select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 md:w-auto"
        aria-label="Filter by category"
      >
        {categoryOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <Button
        variant={showArchived ? "secondary" : "outline"}
        onClick={onToggleArchived}
        leftIcon={
          showArchived ? <RotateCcw size={16} /> : <Archive size={16} />
        }
      >
        {showArchived ? "View Active Meals" : "View Archived"}
      </Button>
    </div>
  );
}
