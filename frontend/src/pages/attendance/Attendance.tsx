import { students } from "../../data/mockData";

export default function Attendance() {
  return (
    <div data-testid="attendance-page" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
        <p className="mt-1 text-sm text-slate-500">Monitor daily presence and aggregate attendance performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Classes", value: 121 },
          { label: "Present", value: 109 },
          { label: "Absent", value: 7 },
          { label: "Leave", value: 5 },
        ].map((stat) => (
          <div data-testid={`attendance-stat-${stat.label.toLowerCase().replaceAll(" ", "-")}`} key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div data-testid="attendance-table" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Batch</th>
                <th className="px-4 py-3 font-medium">Present</th>
                <th className="px-4 py-3 font-medium">Absent</th>
                <th className="px-4 py-3 font-medium">Leave</th>
                <th className="px-4 py-3 font-medium">Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
                  <td className="px-4 py-3 text-slate-600">{student.batch}</td>
                  <td className="px-4 py-3 text-slate-600">{student.attendance.present}</td>
                  <td className="px-4 py-3 text-slate-600">{student.attendance.absent}</td>
                  <td className="px-4 py-3 text-slate-600">{student.attendance.leave}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                      {student.attendance.attendancePercentage}%
                    </span>
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