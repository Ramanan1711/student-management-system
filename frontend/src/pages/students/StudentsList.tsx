import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useDataStore } from "../../store/dataStoreContext";
import { Pagination, SortButton } from "../../components/tables/TableControls";
import { useTableControls } from "../../hooks/useTableControls";

export default function StudentsList() {
  const { students } = useDataStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [modeFilter, setModeFilter] = useState<"All" | "Online" | "Offline" | "Hybrid">("All");

  const filteredStudents = useMemo(() => {
    const search = query.toLowerCase();

    return students.filter((student) => {
      const matchesText = [student.name, student.course, student.batch, student.mobile, student.email]
        .join(" ")
        .toLowerCase()
        .includes(search);
      const matchesMode = modeFilter === "All" || student.mode === modeFilter;
      return matchesText && matchesMode;
    });
  }, [query, modeFilter, students]);

  const table = useTableControls(filteredStudents, 8, (student, key) => {
    if (key === "pending") return student.fee.pendingAmount;
    return student[key as "name" | "course" | "batch" | "mode"];
  });

  return (
    <div data-testid="students-list-page" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Students</h1>
          <p className="mt-1 text-sm text-slate-500">
            {filteredStudents.length} of {students.length} students
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            data-testid="students-mode-filter"
            value={modeFilter}
            onChange={(event) => setModeFilter(event.target.value as typeof modeFilter)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
          >
            <option value="All">All modes</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              data-testid="students-search-input"
              placeholder="Search students"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3"><SortButton label="Student" active={table.sortKey === "name"} direction={table.sortKey === "name" ? table.sortDirection : null} onClick={() => table.sortBy("name")} /></th>
                <th className="px-4 py-3"><SortButton label="Course" active={table.sortKey === "course"} direction={table.sortKey === "course" ? table.sortDirection : null} onClick={() => table.sortBy("course")} /></th>
                <th className="px-4 py-3"><SortButton label="Batch" active={table.sortKey === "batch"} direction={table.sortKey === "batch" ? table.sortDirection : null} onClick={() => table.sortBy("batch")} /></th>
                <th className="px-4 py-3"><SortButton label="Mode" active={table.sortKey === "mode"} direction={table.sortKey === "mode" ? table.sortDirection : null} onClick={() => table.sortBy("mode")} /></th>
                <th className="px-4 py-3"><SortButton label="Fee Pending" active={table.sortKey === "pending"} direction={table.sortKey === "pending" ? table.sortDirection : null} onClick={() => table.sortBy("pending")} /></th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody data-testid="students-table-body">
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                    No students match your filters.
                  </td>
                </tr>
              )}
              {table.paginatedRows.map((student) => (
                <tr
                  key={student.id}
                  data-testid={`student-row-${student.id}`}
                  onClick={() => navigate(`/students/${student.id}`)}
                  className="cursor-pointer border-t border-slate-200 transition hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{student.name}</p>
                      <p className="text-xs text-slate-500">{student.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{student.course}</td>
                  <td className="px-4 py-3 text-slate-600">{student.batch}</td>
                  <td className="px-4 py-3 text-slate-600">{student.mode}</td>
                  <td className="px-4 py-3 text-slate-600">₹{student.fee.pendingAmount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      data-testid={`student-profile-link-${student.id}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/students/${student.id}`);
                      }}
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      View profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={table.currentPage} pageCount={table.pageCount} total={filteredStudents.length} pageSize={8} onPageChange={table.setPage} />
      </div>
    </div>
  );
}
