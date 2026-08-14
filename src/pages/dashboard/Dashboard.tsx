import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, CreditCard, GraduationCap, Users } from "lucide-react";
import { attendanceOverview, batches, dashboardRevenue, students, walkinLeads } from "../../data/mockData";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function Dashboard() {
  const totalStudents = students.length;
  const totalFeePending = students.reduce(
    (sum, student) => sum + student.fee.pendingAmount,
    0,
  );
  const activeWalkins = walkinLeads.filter(
    (lead) => lead.leadStatus !== "Not Interested",
  ).length;

  const stats = [
    {
      title: "Total Students",
      value: totalStudents.toString(),
      accent: "bg-blue-50 text-blue-600",
      icon: GraduationCap,
      trend: "+12%",
    },
    {
      title: "Active Walk-ins",
      value: activeWalkins.toString(),
      accent: "bg-amber-50 text-amber-600",
      icon: Users,
      trend: "+5%",
    },
    {
      title: "Fee Receivable",
      value: currency.format(totalFeePending),
      accent: "bg-emerald-50 text-emerald-600",
      icon: CreditCard,
      trend: "+8%",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Overview of academy performance and student lifecycle.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
          <ArrowUpRight className="h-4 w-4" />
          18% increase this month
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ title, value, accent, icon: Icon, trend }) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`rounded-xl p-3 ${accent}`}>
                <Icon className="h-5 w-5" />
              </div>

              <span className="text-xs font-semibold text-emerald-600">{trend}</span>
            </div>

            <p className="mt-4 text-sm text-slate-500">{title}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Student growth</h2>
            <span className="text-sm text-slate-500">Last 6 months</span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  formatter={(value) => [
                    `₹${Number(value).toLocaleString("en-IN")}`,
                    "Revenue",
                  ]}
                />
                <Line type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Attendance distribution</h2>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceOverview}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#1e293b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Recent walk-ins</h2>

          <div className="space-y-3">
            {walkinLeads.slice(0, 4).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
                <div>
                  <p className="font-medium text-slate-900">{lead.studentName}</p>
                  <p className="text-xs text-slate-500">{lead.courseInterested} • {lead.source}</p>
                </div>

                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                  {lead.leadStatus}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Batch overview</h2>

          <div className="space-y-4">
            {batches.map((batch) => (
              <div key={batch.id} className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">{batch.id}</p>
                  <span className="text-xs text-slate-500">{batch.students.length} students</span>
                </div>

                <p className="mt-1 text-sm text-slate-600">{batch.course}</p>
                <p className="mt-1 text-xs text-slate-500">{batch.classTiming}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}