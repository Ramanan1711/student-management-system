import { useMemo, useState } from "react";

export function useTableControls<T>(rows: T[], pageSize: number, getValue: (row: T, key: string) => string | number) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedRows = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((first, second) => {
      const firstValue = getValue(first, sortKey);
      const secondValue = getValue(second, sortKey);
      const comparison = typeof firstValue === "number" && typeof secondValue === "number"
        ? firstValue - secondValue
        : String(firstValue).localeCompare(String(secondValue));
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [getValue, rows, sortDirection, sortKey]);

  const pageCount = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const paginatedRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const sortBy = (key: string) => {
    if (sortKey === key) setSortDirection((direction) => direction === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setPage(1);
  };

  return { currentPage, pageCount, paginatedRows, sortKey, sortDirection, sortBy, setPage };
}