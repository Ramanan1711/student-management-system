import { useState } from "react";
import { batches as seedBatches, type BatchRecord } from "../../data/mockData";

const initialBatch: Omit<BatchRecord, "id"> = {
  course: "Full Stack Development",
  batchName: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date().toISOString().slice(0, 10),
  classTiming: "6:30 PM - 8:30 PM",
  days: ["Mon", "Wed", "Fri"],
  trainer: "Sathish Kumar",
  students: [],
};

export default function Batches() {
  const [batchList, setBatchList] = useState(seedBatches);
  const [form, setForm] = useState(initialBatch);

  const addBatch = (event: React.FormEvent) => {
    event.preventDefault();

    const nextBatch: BatchRecord = {
      ...form,
      id: `BATCH-${String(batchList.length + 1).padStart(2, "0")}`,
    };

    setBatchList((prev) => [...prev, nextBatch]);
    setForm(initialBatch);
  };

  return (
    <div data-testid="batches-page" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Batch Management</h1>
        <p className="mt-1 text-sm text-slate-500">Manage scheduling, trainers, and student allocation.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div data-testid="batch-list-card" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Active batches</h2>

          <div className="mt-4 space-y-3">
            {batchList.map((batch) => (
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

        <form onSubmit={addBatch} data-testid="batch-form" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Create batch</h2>

          <div className="mt-4 grid gap-4">
            <input value={form.batchName} onChange={(event) => setForm({ ...form, batchName: event.target.value })} placeholder="Batch Name" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            <input value={form.course} onChange={(event) => setForm({ ...form, course: event.target.value })} placeholder="Course" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} type="date" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
              <input value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} type="date" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
            <input value={form.classTiming} onChange={(event) => setForm({ ...form, classTiming: event.target.value })} placeholder="Class Timing" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            <input value={form.days.join(", ")} onChange={(event) => setForm({ ...form, days: event.target.value.split(",").map((day) => day.trim()).filter(Boolean) })} placeholder="Days (Mon, Tue, Wed)" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            <input value={form.trainer} onChange={(event) => setForm({ ...form, trainer: event.target.value })} placeholder="Trainer" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            <button type="submit" data-testid="batch-save-button" className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              Save batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}