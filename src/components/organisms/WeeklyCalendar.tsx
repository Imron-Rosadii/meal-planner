import {
  addDays,
  addWeeks,
  format,
  isSameDay,
  isToday,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Button from "../atoms/Button";

interface WeeklyCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

function WeeklyCalendar({ selectedDate, onDateSelect }: WeeklyCalendarProps) {
  // Derive the displayed week directly from the selected date.
  const weekStart = startOfWeek(selectedDate, {
    weekStartsOn: 1,
  });

  const weekDays = Array.from({ length: 7 }, (_, index) =>
    addDays(weekStart, index),
  );

  const handlePreviousWeek = () => {
    onDateSelect(subWeeks(selectedDate, 1));
  };

  const handleNextWeek = () => {
    onDateSelect(addWeeks(selectedDate, 1));
  };

  const handleToday = () => {
    onDateSelect(new Date());
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-800">Weekly Calendar</h2>

          <p className="mt-1 text-sm text-slate-500">
            {format(weekStart, "MMMM d")} -{" "}
            {format(addDays(weekStart, 6), "MMMM d, yyyy")}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 sm:justify-end">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>

          <Button
            variant="ghost"
            size="sm"
            aria-label="Previous week"
            onClick={handlePreviousWeek}
          >
            <ChevronLeft size={18} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            aria-label="Next week"
            onClick={handleNextWeek}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {weekDays.map((day) => {
          const selected = isSameDay(day, selectedDate);
          const today = isToday(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onDateSelect(day)}
              aria-pressed={selected}
              className={`
                flex min-w-0 flex-col items-center gap-1.5
rounded-lg px-0.5 py-2.5 transition-colors
sm:gap-2 sm:rounded-xl sm:px-1 sm:py-4
                ${
                  selected
                    ? "bg-pink-700 text-white"
                    : "text-slate-600 hover:bg-pink-50"
                }
              `}
            >
              <span className="text-xs font-medium">{format(day, "EEE")}</span>

              <span
                className={`
                  flex h-8 w-8 items-center justify-center
rounded-full text-xs font-semibold
sm:h-9 sm:w-9 sm:text-sm
                  ${
                    selected
                      ? "bg-white/20 text-white"
                      : today
                        ? "bg-pink-100 text-pink-700"
                        : "text-slate-800"
                  }
                `}
              >
                {format(day, "d")}
              </span>

              {today && (
                <span
                  className={`h-1 w-1 rounded-full ${
                    selected ? "bg-white" : "bg-pink-600"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default WeeklyCalendar;
