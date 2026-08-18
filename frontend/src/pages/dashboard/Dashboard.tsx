import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BriefcaseBusiness, ChartColumnBig, TrendingUp, Users } from "lucide-react";
import { useDataStore } from "../../store/DataStore";

const revenueOverview = [
  { month: "JAN", value: 48 },
  { month: "FEB", value: 62 },
  { month: "MAR", value: 54 },
  { month: "APR", value: 72 },
  { month: "MAY", value: 58 },
  { month: "JUN", value: 80 },
  { month: "JUL", value: 66 },
  { month: "AUG", value: 95 },
  { month: "SEP", value: 74 },
  { month: "OCT", value: 64 },
  { month: "NOV", value: 70 },
  { month: "DEC", value: 60 },
];

const AXIS_TICK = { fontSize: 10, fill: "#64748b" };
const BAR_RADIUS: [number, number, number, number] = [6, 6, 0, 0];

export default function Dashboard() {
  const { students, walkins, batches, tasks } = useDataStore();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<"12 Months" | "6 Months" | "30 Days">("12 Months");

  const chartData = useMemo(
    () =>
      period === "12 Months"
        ? revenueOverview
        : period === "6 Months"
        ? revenueOverview.slice(6)
        : revenueOverview.slice(9),
    [period],
  );

  const totalPending = students.reduce((sum, s) => sum + s.fee.pendingAmount, 0);
  const totalPaid = students.reduce((sum, s) => sum + s.fee.amountPaid, 0);

  const stats = [
    {
      label: "TOTAL REVENUE",
      value: `₹${totalPaid.toLocaleString("en-IN")}`,
      icon: ChartColumnBig,
      color: "#f5f0df",
      trend: "+12.5%",
    },
    {
      label: "ACTIVE STUDENTS",
      value: String(students.length),
      icon: Users,
      color: "#f2efe9",
      trend: "+5.2%",
    },
    {
      label: "PENDING FEES",
      value: `₹${totalPending.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      color: "#f3eee5",
      trend: "-8.1%",
    },
    {
      label: "ACTIVE BATCHES",
      value: String(batches.length),
      icon: BriefcaseBusiness,
      color: "#f4f1ea",
      trend: `${walkins.length} leads`,
    },
  ];

  const recentActivity = useMemo(
    () => [
      ...walkins.slice(0, 3).map((lead) => ({
        id: lead.id,
        name: lead.studentName,
        role: `Walk-in · ${lead.courseInterested}`,
        status: lead.leadStatus,
        amount: lead.followUpDate,
      })),
      ...tasks.slice(0, 2).map((task) => ({
        id: task.id,
        name: task.title,
        role: `Task · ${task.priority}`,
        status: task.status,
        amount: task.dueDate,
      })),
    ],
    [walkins, tasks],
  );

  return (
    <div data-testid="dashboard-page" className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, trend }) => (
          <div data-testid={`dashboard-kpi-${label.toLowerCase().replaceAll(" ", "-")}`} key={label} className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="rounded-xl p-2.5" style={{ backgroundColor: color }}>
                <Icon className="h-5 w-5 text-slate-700" />
              </div>

              <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-600">
                {trend}
              </span>
            </div>

            <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">{label}</p>
            <p className="mt-2 text-[24px] font-semibold tracking-tight text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      <div data-testid="revenue-overview-card" className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-semibold text-slate-800">Revenue Overview</h2>
            <p data-testid="revenue-period-label" className="text-xs text-slate-500">Year 2026 Performance · {period}</p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600">
            {(["12 Months", "6 Months", "30 Days"] as const).map((option) => <button type="button" key={option} data-testid={`revenue-filter-${option.toLowerCase().replaceAll(" ", "-")}`} onClick={() => setPeriod(option)} className={`rounded-full px-2 py-1 ${period === option ? "bg-slate-900 text-white" : "hover:bg-slate-100"}`}>{option}</button>)}
          </div>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={8}>
              <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={AXIS_TICK} />
              <YAxis tickLine={false} axisLine={false} tick={AXIS_TICK} />
              <Tooltip />
              <Bar dataKey="value" radius={BAR_RADIUS}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.month}
                    fill={entry.month === "AUG" ? "#6b7f9a" : "#dfe5ea"}
                    opacity={entry.month === "AUG" ? 1 : 0.95}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div data-testid="recent-activity-card" className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-slate-800">Recent Activity</h2>
          <button
            type="button"
            data-testid="recent-activity-view-all"
            onClick={() => navigate("/reports")}
            className="text-sm font-medium text-blue-700 hover:text-blue-900"
          >
            View All
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f8f8f6] text-[11px] uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">No recent activity yet.</td></tr>
              )}
              {recentActivity.map((row) => (
                <tr key={row.id} className="border-t border-slate-200">
                  <td className="px-4 py-4 font-medium text-slate-700">{row.id}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold uppercase text-slate-700">
                        {row.name.slice(0, 1)}
                      </div>
                      <span className="text-slate-700">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{row.role}</td>
                  <td className="px-4 py-4">
                    <span data-testid={`activity-status-${row.id}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right font-semibold text-slate-700">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
