import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useDataStore } from "../../store/dataStoreContext";

export default function ClassReports() {
  const { classReports } = useDataStore();
  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const batches = useMemo(
    () => ["All", ...Array.from(new Set(classReports.map((r) => r.batch)))],
    [classReports],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return classReports.filter((report) => {
      const matchesText = [report.topic, report.trainer, report.module, report.batch]
        .join(" ")
        .toLowerCase()
        .includes(q);
      const matchesBatch = batchFilter === "All" || report.batch === batchFilter;
      return matchesText && matchesBatch;
    });
  }, [classReports, search, batchFilter]);

  const selected = classReports.find((r) => r.id === selectedId);

  return (
    <div data-testid="class-reports-page" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Class / Training Reports</h1>
          <p className="mt-1 text-sm text-slate-500">Track class learning, task status, and trainer notes by batch.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select data-testid="class-reports-batch-filter" value={batchFilter} onChange={(event) => setBatchFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            {batches.map((b) => (
              <option key={b} value={b}>{b === "All" ? "All batches" : b}</option>
            ))}
          </select>

          <label className="relative block w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              data-testid="class-reports-search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search topic / trainer"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400"
            />
          </label>
        </div>
      </div>

      <div data-testid="class-reports-table" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Batch</th>
                <th className="px-4 py-3 font-medium">Trainer</th>
                <th className="px-4 py-3 font-medium">Topic</th>
                <th className="px-4 py-3 font-medium">Task Status</th>
                <th className="px-4 py-3 font-medium">Attendance</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">No reports match your filters.</td>
                </tr>
              )}
              {filtered.map((report) => (
                <tr key={report.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600">{report.date}</td>
                  <td className="px-4 py-3 text-slate-600">{report.batch}</td>
                  <td className="px-4 py-3 text-slate-600">{report.trainer}</td>
                  <td className="px-4 py-3 text-slate-800 font-medium">{report.topic}</td>
                  <td data-testid={`class-report-status-${report.id}`} className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{report.taskStatus}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{report.studentAttendance}%</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      data-testid={`class-report-view-${report.id}`}
                      onClick={() => setSelectedId(report.id)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setSelectedId(null)}>
          <div data-testid="class-report-detail" onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selected.topic}</h2>
                <p className="text-sm text-slate-500">{selected.batch} · {selected.trainer} · {selected.date}</p>
              </div>
              <button data-testid="class-report-detail-close" onClick={() => setSelectedId(null)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Close</button>
            </div>

            <dl className="grid gap-4 md:grid-cols-2 text-sm">
              <div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">Module</dt><dd className="mt-1 font-semibold text-slate-900">{selected.module}</dd></div>
              <div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">Attendance</dt><dd className="mt-1 font-semibold text-slate-900">{selected.studentAttendance}%</dd></div>
              <div className="rounded-xl bg-slate-50 p-3 md:col-span-2"><dt className="text-slate-500">Description</dt><dd className="mt-1 text-slate-800">{selected.description}</dd></div>
              <div className="rounded-xl bg-slate-50 p-3 md:col-span-2"><dt className="text-slate-500">Tasks given</dt><dd className="mt-1 text-slate-800">{selected.tasksGiven}</dd></div>
              <div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">Task status</dt><dd className="mt-1 font-semibold text-slate-900">{selected.taskStatus}</dd></div>
              <div className="rounded-xl bg-slate-50 p-3"><dt className="text-slate-500">Performance</dt><dd className="mt-1 font-semibold text-slate-900">{selected.studentPerformance}</dd></div>
              <div className="rounded-xl bg-slate-50 p-3 md:col-span-2"><dt className="text-slate-500">Trainer remarks</dt><dd className="mt-1 text-slate-800">{selected.remarks}</dd></div>
              <div className="rounded-xl bg-slate-50 p-3 md:col-span-2"><dt className="text-slate-500">Next class plan</dt><dd className="mt-1 text-slate-800">{selected.nextClassPlan}</dd></div>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
