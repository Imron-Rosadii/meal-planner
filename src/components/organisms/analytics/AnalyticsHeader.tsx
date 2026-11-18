import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  FileDown,
} from "lucide-react";
import { format } from "date-fns";

interface AnalyticsHeaderProps {
  weekStart: Date;
  weekEnd: Date;
  onPreviousWeek: () => void;
  onCurrentWeek: () => void;
  onNextWeek: () => void;
  onExport: () => void;
  onExportPdf: () => void;
  isExportingPdf: boolean;
  canExport: boolean;
}

function AnalyticsHeader({
  weekStart,
  weekEnd,
  onPreviousWeek,
  onCurrentWeek,
  onNextWeek,
  onExport,
  onExportPdf,
  isExportingPdf,
  canExport,
}: AnalyticsHeaderProps) {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-pink-50 p-2 text-pink-600">
          <CalendarDays size={20} />
        </div>

        <div>
          <h2 className="font-semibold text-slate-800">Weekly Analytics</h2>

          <p className="text-sm text-slate-500">
            {format(weekStart, "d MMM")} – {format(weekEnd, "d MMM yyyy")}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onPreviousWeek}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
          aria-label="Previous week"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          onClick={onCurrentWeek}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          This week
        </button>

        <button
          type="button"
          onClick={onNextWeek}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50"
          aria-label="Next week"
        >
          <ChevronRight size={18} />
        </button>

        {canExport && (
          <>
            <button
              type="button"
              onClick={onExport}
              className="flex items-center justify-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
            >
              <Download size={16} />
              Export CSV
            </button>

            <button
              type="button"
              onClick={onExportPdf}
              disabled={isExportingPdf}
              className="flex items-center justify-center gap-2 rounded-lg bg-red-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FileDown size={16} />
              {isExportingPdf ? "Generating PDF..." : "Export PDF"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}

export default AnalyticsHeader;
