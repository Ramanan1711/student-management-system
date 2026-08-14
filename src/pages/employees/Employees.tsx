import { useMemo, useState } from "react";
import { employees as seedEmployees } from "../../data/mockData";

export default function Employees() {
  const [filter, setFilter] = useState("All");

  const filteredEmployees = useMemo(() => {
    if (filter === "All") {
      return seedEmployees;
    }

    return seedEmployees.filter((employee) => employee.type === filter);
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees & Trainers</h1>
          <p className="mt-1 text-sm text-slate-500">Assign and manage staff allocation across departments.</p>
        </div>

        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="All">All types</option>
          <option value="Trainer">Trainer</option>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Video Editor">Video Editor</option>
          <option value="Digital Marketing">Digital Marketing</option>
          <option value="Counsellor">Counsellor</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {employee.name.slice(0, 1)}
              </div>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700">
                {employee.availability}
              </span>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">{employee.name}</h2>
            <p className="text-sm text-slate-500">{employee.type}</p>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p>{employee.email}</p>
              <p>{employee.phone}</p>
              <p>{employee.allocatedStudents} allocated students</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}