import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { students } from "../../data/mockData";

const monthlyProgress = [
  { name: "Jan", value: 48 },
  { name: "Feb", value: 56 },
  { name: "Mar", value: 62 },
  { name: "Apr", value: 71 },
  { name: "May", value: 77 },
  { name: "Jun", value: 82 },
];

export default function Reports() {
  const averageFee = Math.round(students.reduce((sum, student) => sum + student.fee.pendingAmount, 0) / students.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">Student progress, attendance, and fee summary across the academy.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Average Batch Progress</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">82%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Average Attendance</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">89%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Avg. Pending Fee</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">₹{averageFee.toLocaleString("en-IN")}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Progress overview</h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="value" fill="#1e293b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}