import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useDataStore } from "../../store/dataStoreContext";
import { getBatchName } from "../../data/mockData";

type Metric = "overallPerformance" | "technicalKnowledge" | "practicalSkills" | "communication" | "attendance" | "taskCompletion" | "behaviour";

const metricLabels: Record<Metric, string> = {
  overallPerformance: "Overall",
  technicalKnowledge: "Technical",
  practicalSkills: "Practical",
  communication: "Communication",
  attendance: "Attendance",
  taskCompletion: "Task Completion",
  behaviour: "Behaviour",
};

const CHART_DOMAIN: [number, number] = [0, 100];
const BAR_RADIUS: [number, number, number, number] = [8, 8, 0, 0];

export default function Performance() {
  const { students, batches: batchRecords } = useDataStore();
  const [metric, setMetric] = useState<Metric>("overallPerformance");
  const [batchFilter, setBatchFilter] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const batches = useMemo(
    () => ["All", ...batchRecords.map((batch) => batch.id)],
    [batchRecords],
  );

  const filtered = useMemo(
    () => (batchFilter === "All" ? students : students.filter((s) => s.batchId === batchFilter)),
    [students, batchFilter],
  );

  const chartData = useMemo(
    () =>
      filtered.map((s) => ({
        name: s.name,
        value: s.performance[metric],
      })),
    [filtered, metric],
  );

  const selected = students.find((s) => s.id === selectedId);

  return (
    <div data-testid="performance-page" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Performance</h1>
          <p className="mt-1 text-sm text-slate-500">Track key performance metrics across technical, communication, and behaviour criteria.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select data-testid="performance-metric-filter" value={metric} onChange={(event) => setMetric(event.target.value as Metric)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            {(Object.keys(metricLabels) as Metric[]).map((m) => (
              <option key={m} value={m}>{metricLabels[m]}</option>
            ))}
          </select>
          <select data-testid="performance-batch-filter" value={batchFilter} onChange={(event) => setBatchFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            {batches.map((b) => (
              <option key={b} value={b}>{b === "All" ? "All batches" : b}</option>
            ))}
          </select>
        </div>
      </div>

      <div data-testid="performance-chart-card" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">{metricLabels[metric]} performance</h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" domain={CHART_DOMAIN} />
              <Tooltip />
              <Bar dataKey="value" fill="#0f172a" radius={BAR_RADIUS} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div data-testid="performance-table" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Batch</th>
                <th className="px-4 py-3 font-medium">Technical</th>
                <th className="px-4 py-3 font-medium">Practical</th>
                <th className="px-4 py-3 font-medium">Communication</th>
                <th className="px-4 py-3 font-medium">Attendance</th>
                <th className="px-4 py-3 font-medium">Overall</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">No students match filters.</td></tr>
              )}
              {filtered.map((student) => (
                <tr key={student.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
                  <td className="px-4 py-3 text-slate-600">{getBatchName(student.batchId, batchRecords)}</td>
                  <td className="px-4 py-3 text-slate-600">{student.performance.technicalKnowledge}</td>
                  <td className="px-4 py-3 text-slate-600">{student.performance.practicalSkills}</td>
                  <td className="px-4 py-3 text-slate-600">{student.performance.communication}</td>
                  <td className="px-4 py-3 text-slate-600">{student.performance.attendance}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{student.performance.overallPerformance}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      data-testid={`performance-view-${student.id}`}
                      onClick={() => setSelectedId(student.id)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Drill down
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
          <div data-testid="performance-detail" onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selected.name}</h2>
                <p className="text-sm text-slate-500">{getBatchName(selected.batchId, batchRecords)} · {selected.course}</p>
              </div>
              <button data-testid="performance-detail-close" onClick={() => setSelectedId(null)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Close</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {(Object.keys(metricLabels) as Metric[]).map((m) => (
                <div key={m} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">{metricLabels[m]}</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">{selected.performance[m]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
