import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { performanceRecords } from "../../data/mockData";

export default function Performance() {
  return (
    <div data-testid="performance-page" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Student Performance</h1>
        <p className="mt-1 text-sm text-slate-500">Track key performance metrics across technical, communication, and behaviour criteria.</p>
      </div>

      <div data-testid="performance-chart-card" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Overall performance</h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceRecords}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="overallPerformance" fill="#0f172a" radius={[8, 8, 0, 0]} />
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
                <th className="px-4 py-3 font-medium">Technical</th>
                <th className="px-4 py-3 font-medium">Practical</th>
                <th className="px-4 py-3 font-medium">Communication</th>
                <th className="px-4 py-3 font-medium">Attendance</th>
                <th className="px-4 py-3 font-medium">Overall</th>
              </tr>
            </thead>
            <tbody>
              {performanceRecords.map((record) => (
                <tr key={record.name} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-900">{record.name}</td>
                  <td className="px-4 py-3 text-slate-600">{record.technicalKnowledge}</td>
                  <td className="px-4 py-3 text-slate-600">{record.practicalSkills}</td>
                  <td className="px-4 py-3 text-slate-600">{record.communication}</td>
                  <td className="px-4 py-3 text-slate-600">{record.attendance}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{record.overallPerformance}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}