import { classReports as seedReports } from "../../data/mockData";

export default function ClassReports() {
  return (
    <div data-testid="class-reports-page" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Class / Training Reports</h1>
        <p className="mt-1 text-sm text-slate-500">Track class learning, task status, and trainer notes by batch.</p>
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
              </tr>
            </thead>
            <tbody>
              {seedReports.map((report) => (
                <tr key={report.id} className="border-t border-slate-200">
                  <td className="px-4 py-3 text-slate-600">{report.date}</td>
                  <td className="px-4 py-3 text-slate-600">{report.batch}</td>
                  <td className="px-4 py-3 text-slate-600">{report.trainer}</td>
                  <td className="px-4 py-3 text-slate-600">{report.topic}</td>
                  <td data-testid={`class-report-status-${report.id}`} className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{report.taskStatus}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{report.studentAttendance}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}