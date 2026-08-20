import { useMemo, useState } from "react";
import { Download, Printer } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useDataStore } from "../../store/dataStoreContext";
import { useToast } from "../../components/ui/toastContext";
import { getBatchName } from "../../data/mockData";
import { Pagination, SortButton } from "../../components/tables/TableControls";
import { useTableControls } from "../../hooks/useTableControls";

const CHART_DOMAIN: [number, number] = [0, 100];
const BAR_RADIUS: [number, number, number, number] = [8, 8, 0, 0];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type ReportView = "attendance" | "fee" | "progress";

export default function Reports() {
  const { students, batches: batchRecords } = useDataStore();
  const { showToast } = useToast();
  const [view, setView] = useState<ReportView>("progress");
  const [batchFilter, setBatchFilter] = useState<string>("All");

  const batches = useMemo(
    () => ["All", ...batchRecords.map((batch) => batch.id)],
    [batchRecords],
  );

  const filteredStudents = useMemo(
    () => (batchFilter === "All" ? students : students.filter((s) => s.batchId === batchFilter)),
    [students, batchFilter],
  );

  const table = useTableControls(filteredStudents, 8, (student, key) => {
    if (key === "metric") {
      if (view === "attendance") return student.attendance.attendancePercentage;
      if (view === "fee") return student.fee.pendingAmount;
      return student.performance.overallPerformance;
    }
    if (key === "batch") return getBatchName(student.batchId, batchRecords);
    return student[key as "name"];
  });

  const totals = useMemo(() => {
    if (filteredStudents.length === 0) {
      return { avgAttendance: 0, avgFeePending: 0, avgPerformance: 0 };
    }
    return {
      avgAttendance: Math.round(
        filteredStudents.reduce((s, x) => s + x.attendance.attendancePercentage, 0) / filteredStudents.length,
      ),
      avgFeePending: Math.round(
        filteredStudents.reduce((s, x) => s + x.fee.pendingAmount, 0) / filteredStudents.length,
      ),
      avgPerformance: Math.round(
        filteredStudents.reduce((s, x) => s + x.performance.overallPerformance, 0) / filteredStudents.length,
      ),
    };
  }, [filteredStudents]);

  const chartData = useMemo(() => {
    const year = new Date().getFullYear();
    return MONTHS.map((name, monthIndex) => {
      const monthEnd = new Date(year, monthIndex + 1, 0);
      const activeStudents = filteredStudents.filter((student) => new Date(`${student.joiningDate}T00:00:00`) <= monthEnd);
      let value = 0;

      if (view === "fee") {
        value = filteredStudents
          .filter((student) => {
            const paymentDate = new Date(`${student.fee.paymentDate}T00:00:00`);
            return paymentDate.getFullYear() === year && paymentDate.getMonth() === monthIndex;
          })
          .reduce((sum, student) => sum + student.fee.amountPaid, 0);
      } else if (activeStudents.length > 0) {
        value = Math.round(
          activeStudents.reduce(
            (sum, student) => sum + (view === "attendance" ? student.attendance.attendancePercentage : student.performance.overallPerformance),
            0,
          ) / activeStudents.length,
        );
      }

      return { name, value };
    });
  }, [filteredStudents, view]);

  const chartDomain: [number, number] = view === "fee"
    ? [0, Math.max(1000, Math.ceil(Math.max(...chartData.map((entry) => entry.value), 0) * 1.2 / 1000) * 1000)]
    : CHART_DOMAIN;

  const exportCSV = () => {
    const rows = [
      ["Name", "Batch", "Course", "Attendance %", "Pending Fee", "Overall Performance"],
      ...filteredStudents.map((s) => [
        s.name,
        getBatchName(s.batchId, batchRecords),
        s.course,
        s.attendance.attendancePercentage,
        s.fee.pendingAmount,
        s.performance.overallPerformance,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report-${view}-${batchFilter}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Report exported as CSV");
  };

  const printReport = () => {
    showToast("Preparing print view...", "info");
    setTimeout(() => window.print(), 400);
  };

  return (
    <div data-testid="reports-page" className="space-y-6">
      <div className="reports-toolbar flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
          <p className="mt-1 text-sm text-slate-500">Student progress, attendance, and fee summary across the academy.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select data-testid="reports-view-filter" value={view} onChange={(event) => setView(event.target.value as ReportView)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <option value="progress">Progress</option>
            <option value="attendance">Attendance</option>
            <option value="fee">Fee</option>
          </select>
          <select data-testid="reports-batch-filter" value={batchFilter} onChange={(event) => setBatchFilter(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            {batches.map((b) => (
              <option key={b} value={b}>{b === "All" ? "All batches" : b}</option>
            ))}
          </select>
          <button type="button" data-testid="reports-export-button" onClick={exportCSV} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button type="button" data-testid="reports-print-button" onClick={printReport} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700">
            <Printer className="h-4 w-4" /> Print
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Average Performance</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totals.avgPerformance}%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Average Attendance</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totals.avgAttendance}%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Avg. Pending Fee</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">₹{totals.avgFeePending.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div data-testid="reports-chart-card" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">{view === "progress" ? "Progress overview" : view === "attendance" ? "Attendance overview" : "Fee overview"}</h2>

        <div className="reports-chart-area reports-chart-responsive h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" interval={0} angle={-35} textAnchor="end" height={60} stroke="#64748b" />
              <YAxis stroke="#64748b" domain={chartDomain} tickFormatter={(value) => view === "fee" ? `₹${Number(value).toLocaleString("en-IN")}` : `${value}%`} />
              <Tooltip formatter={(value) => view === "fee" ? `₹${Number(value).toLocaleString("en-IN")}` : `${value}%`} />
              <Bar dataKey="value" fill="#1e293b" radius={BAR_RADIUS} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="reports-chart-print" aria-hidden="true">
          <BarChart width={660} height={360} data={chartData} margin={{ top: 8, right: 12, bottom: 52, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" interval={0} angle={-35} textAnchor="end" height={60} stroke="#64748b" />
            <YAxis stroke="#64748b" domain={chartDomain} tickFormatter={(value) => view === "fee" ? `₹${Number(value).toLocaleString("en-IN")}` : `${value}%`} />
            <Bar dataKey="value" fill="#1e293b" radius={BAR_RADIUS} />
          </BarChart>
        </div>
      </div>

      <div data-testid="reports-table" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3"><SortButton label="Student" active={table.sortKey === "name"} direction={table.sortKey === "name" ? table.sortDirection : null} onClick={() => table.sortBy("name")} /></th>
                <th className="px-4 py-3"><SortButton label="Batch" active={table.sortKey === "batch"} direction={table.sortKey === "batch" ? table.sortDirection : null} onClick={() => table.sortBy("batch")} /></th>
                <th className="px-4 py-3"><SortButton label={view === "attendance" ? "Attendance %" : view === "fee" ? "Fee Pending" : "Overall"} active={table.sortKey === "metric"} direction={table.sortKey === "metric" ? table.sortDirection : null} onClick={() => table.sortBy("metric")} /></th>
              </tr>
            </thead>
            <tbody>
              {table.paginatedRows.map((student) => (
                <tr key={student.id} data-testid={`reports-row-${student.id}`} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
                  <td className="px-4 py-3 text-slate-600">{getBatchName(student.batchId, batchRecords)}</td>
                  {view === "attendance" && <td className="px-4 py-3 text-slate-600">{student.attendance.attendancePercentage}%</td>}
                  {view === "fee" && <td className="px-4 py-3 text-slate-600">₹{student.fee.pendingAmount.toLocaleString("en-IN")}</td>}
                  {view === "progress" && <td className="px-4 py-3 text-slate-600">{student.performance.overallPerformance}%</td>}
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
