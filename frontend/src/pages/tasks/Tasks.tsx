import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { useDataStore } from "../../store/dataStoreContext";
import { useToast } from "../../components/ui/toastContext";
import type { TaskRecord } from "../../data/mockData";

const priorities: TaskRecord["priority"][] = ["Low", "Medium", "High", "Urgent"];
const statuses: TaskRecord["status"][] = ["Pending", "In Progress", "Completed"];

const priorityStyle: Record<TaskRecord["priority"], string> = {
  Low: "bg-slate-100 text-slate-700",
  Medium: "bg-blue-50 text-blue-700",
  High: "bg-amber-50 text-amber-700",
  Urgent: "bg-red-50 text-red-700",
};

const statusStyle: Record<TaskRecord["status"], string> = {
  Pending: "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-50 text-blue-700",
  Completed: "bg-emerald-50 text-emerald-700",
};

export default function Tasks() {
  const { tasks, students, addTask, updateTaskStatus } = useDataStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"All" | TaskRecord["priority"]>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | TaskRecord["status"]>("All");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Omit<TaskRecord, "id">>({
    title: "",
    description: "",
    assignedDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date().toISOString().slice(0, 10),
    priority: "Medium",
    status: "Pending",
    trainerRemarks: "",
    studentId: students[0]?.id ?? "",
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return tasks.filter((task) => {
      const matchesText = [task.title, task.description].join(" ").toLowerCase().includes(q);
      const matchesPriority = priorityFilter === "All" || task.priority === priorityFilter;
      const matchesStatus = statusFilter === "All" || task.status === statusFilter;
      return matchesText && matchesPriority && matchesStatus;
    });
  }, [tasks, search, priorityFilter, statusFilter]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.title || !form.dueDate || !form.studentId) {
      setError("Title, due date, and student are required.");
      return;
    }
    const created = addTask(form);
    showToast(`Task "${created.title}" assigned`);
    setForm({ ...form, title: "", description: "", trainerRemarks: "" });
    setError("");
    setShowForm(false);
  };

  const toggleComplete = (task: TaskRecord) => {
    const next: TaskRecord["status"] = task.status === "Completed" ? "In Progress" : "Completed";
    updateTaskStatus(task.id, next);
    showToast(`Task marked ${next}`);
  };

  return (
    <div data-testid="tasks-page" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">Assign tasks, track priority, and review student completion.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select data-testid="tasks-priority-filter" value={priorityFilter} onChange={(event) => setPriorityFilter(event.target.value as typeof priorityFilter)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="All">All priorities</option>
            {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <select data-testid="tasks-status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="All">All statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <label className="relative block w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              data-testid="tasks-search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400"
            />
          </label>
          <button
            type="button"
            data-testid="tasks-add-button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Assign task
          </button>
        </div>
      </div>

      <div data-testid="tasks-table" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Task</th>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Due</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                    No tasks match your filters.
                  </td>
                </tr>
              )}
              {filtered.map((task) => {
                const student = students.find((entry) => entry.id === task.studentId);

                return (
                  <tr data-testid={`task-row-${task.id}`} key={task.id} className="border-t border-slate-200">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{task.title}</p>
                      <p className="text-xs text-slate-500">{task.description}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{student?.name ?? task.studentId}</td>
                    <td className="px-4 py-3 text-slate-600">{task.dueDate}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${priorityStyle[task.priority]}`}>{task.priority}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyle[task.status]}`}>{task.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        data-testid={`task-toggle-${task.id}`}
                        onClick={() => toggleComplete(task)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {task.status === "Completed" ? "Reopen" : "Mark complete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setShowForm(false)}>
          <form onSubmit={submit} data-testid="task-form" onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Assign a new task</h2>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4">
              {error && <p data-testid="task-form-error" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
              <input data-testid="task-title-input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Task title" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
              <textarea data-testid="task-description-input" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description" rows={3} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
              <div className="grid gap-4 sm:grid-cols-2">
                <select data-testid="task-student-select" value={form.studentId} onChange={(event) => setForm({ ...form, studentId: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <input value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} type="date" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <select data-testid="task-priority-input" value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as TaskRecord["priority"] })} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                  {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as TaskRecord["status"] })} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" data-testid="task-save-button" className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  Save task
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
