import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";

export function SortButton({
  label,
  active,
  direction,
  onClick,
}: {
  label: string;
  active: boolean;
  direction: "asc" | "desc" | null;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1 font-medium hover:text-slate-900">
      {label}
      <span aria-hidden="true" className="text-slate-400">{active ? (direction === "asc" ? "↑" : "↓") : <ChevronsUpDown className="h-3.5 w-3.5" />}</span>
    </button>
  );
}

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}) {
  if (total === 0) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
      <span>Showing {start}-{end} of {total}</span>
      <div className="flex items-center gap-2">
        <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => onPageChange(page - 1)} className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
        <span>Page {page} of {pageCount}</span>
        <button type="button" aria-label="Next page" disabled={page === pageCount} onClick={() => onPageChange(page + 1)} className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}