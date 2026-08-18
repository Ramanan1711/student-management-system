import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { useDataStore } from "../../store/DataStore";
import { useToast } from "../../components/ui/Toast";
import type { BatchRecord } from "../../data/mockData";

const initialBatch: Omit<BatchRecord, "id"> = {
  course: "Full Stack Development",
  batchName: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  classTiming: "6:30 PM - 8:30 PM",
  days: ["Mon", "Wed", "Fri"],
  trainer: "",
  students: [],
};

export default function Batches() {
  const { batches, employees, addBatch } = useDataStore();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialBatch);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const trainerOptions = useMemo(
    () => employees.filter((e) => e.type === "Trainer"),
    [employees],
  );

  const filteredBatches = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return batches;
    return batches.filter((batch) =>
      [batch.batchName, batch.course, batch.trainer, batch.id]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [search, batches]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.batchName || !form.course || !form.trainer) {
      setError("Batch name, course and trainer are required.");
      return;
    }
    const created = addBatch(form);
    showToast(`Batch ${created.batchName} created`);
    setForm(initialBatch);
    setError("");
    setShowForm(false);
  };

  return (
    <div data-testid="batches-page" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Batch Management</h1>
          <p className="mt-1 text-sm text-slate-500">Manage scheduling, trainers, and student allocation.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              data-testid="batches-search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search batches"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400"
            />
          </label>

          <button
            type="button"
            data-testid="batches-add-button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Create batch
          </button>
        </div>
      </div>

      <div data-testid="batch-list-card" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Active batches</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredBatches.length === 0 && (
            <p className="col-span-full py-6 text-center text-sm text-slate-500">No batches match your search.</p>
          )}
          {filteredBatches.map((batch) => (
            <div data-testid={`batch-card-${batch.id}`} key={batch.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{batch.batchName}</p>
                  <p className="text-sm text-slate-500">{batch.course} • {batch.id}</p>
                </div>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-medium text-slate-700">{batch.students.length} students</span>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <p><span className="font-medium text-slate-800">Trainer:</span> {batch.trainer}</p>
                <p><span className="font-medium text-slate-800">Timing:</span> {batch.classTiming}</p>
                <p><span className="font-medium text-slate-800">Start:</span> {batch.startDate}</p>
                <p><span className="font-medium text-slate-800">End:</span> {batch.endDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setShowForm(false)}>
          <form onSubmit={submit} data-testid="batch-form" onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Create batch</h2>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4">
              {error && <p data-testid="batch-form-error" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
              <input data-testid="batch-name-input" value={form.batchName} onChange={(event) => setForm({ ...form, batchName: event.target.value })} placeholder="Batch Name" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
              <input data-testid="batch-course-input" value={form.course} onChange={(event) => setForm({ ...form, course: event.target.value })} placeholder="Course" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} type="date" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
                <input value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} type="date" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
              </div>
              <input value={form.classTiming} onChange={(event) => setForm({ ...form, classTiming: event.target.value })} placeholder="Class Timing" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
              <input value={form.days.join(", ")} onChange={(event) => setForm({ ...form, days: event.target.value.split(",").map((day) => day.trim()).filter(Boolean) })} placeholder="Days (Mon, Tue, Wed)" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
              <select data-testid="batch-trainer-select" value={form.trainer} onChange={(event) => setForm({ ...form, trainer: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                <option value="">Select trainer</option>
                {trainerOptions.map((trainer) => (
                  <option key={trainer.id} value={trainer.name}>{trainer.name}</option>
                ))}
              </select>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" data-testid="batch-save-button" className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  Save batch
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
