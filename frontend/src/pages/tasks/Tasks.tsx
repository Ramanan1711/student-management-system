import { tasks as seedTasks, students } from "../../data/mockData";

export default function Tasks() {
  return (
    <div data-testid="tasks-page" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Student Tasks</h1>
        <p className="mt-1 text-sm text-slate-500">Assign tasks, track priority, and review student completion.</p>
      </div>

      <div data-testid="tasks-table" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Task</th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Assigned</th>
                <th className="px-4 py-3 font-medium">Due</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {seedTasks.map((task) => {
                const student = students.find((entry) => entry.id === task.studentId);

                return (
                  <tr data-testid={`task-row-${task.id}`} key={task.id} className="border-t border-slate-200">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <p className="text-xs text-slate-500">{task.description}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{student?.name ?? task.studentId}</td>
                    <td className="px-4 py-3 text-slate-600">{task.assignedDate}</td>
                    <td className="px-4 py-3 text-slate-600">{task.dueDate}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">{task.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">{task.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}