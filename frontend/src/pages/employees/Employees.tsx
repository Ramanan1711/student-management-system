import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { useDataStore } from "../../store/DataStore";
import { useToast } from "../../components/ui/Toast";
import type { EmployeeRecord } from "../../data/mockData";

const employeeTypes: EmployeeRecord["type"][] = [
  "Trainer",
  "Developer",
  "Designer",
  "Video Editor",
  "Digital Marketing",
  "Counsellor",
];

const initialEmployee: Omit<EmployeeRecord, "id"> = {
  name: "",
  type: "Trainer",
  department: "Academics",
  phone: "",
  email: "",
  allocatedStudents: 0,
  availability: "Available",
};

export default function Employees() {
  const { employees, addEmployee } = useDataStore();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<"All" | EmployeeRecord["type"]>("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialEmployee);
  const [error, setError] = useState("");

  const filteredEmployees = useMemo(() => {
    const q = search.toLowerCase();
    return employees.filter((employee) => {
      const matchesType = filter === "All" || employee.type === filter;
      const matchesText = [employee.name, employee.department, employee.email, employee.phone]
        .join(" ")
        .toLowerCase()
        .includes(q);
      return matchesType && matchesText;
    });
  }, [filter, search, employees]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError("Name, email, and phone are required.");
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }
    const created = addEmployee(form);
    showToast(`${created.name} added to staff`);
    setForm(initialEmployee);
    setError("");
    setShowForm(false);
  };

  return (
    <div data-testid="employees-page" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees & Trainers</h1>
          <p className="mt-1 text-sm text-slate-500">Assign and manage staff allocation across departments.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select data-testid="employee-type-filter" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="All">All types</option>
            {employeeTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <label className="relative block w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              data-testid="employees-search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search employees"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400"
            />
          </label>

          <button
            type="button"
            data-testid="employees-add-button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Add employee
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {filteredEmployees.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-slate-500">No employees match your filters.</p>
        )}
        {filteredEmployees.map((employee) => (
          <div data-testid={`employee-card-${employee.id}`} key={employee.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setShowForm(false)}>
          <form onSubmit={submit} data-testid="employee-form" onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Add employee</h2>
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4">
              {error && <p data-testid="employee-form-error" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
              <input data-testid="employee-name-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full name" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
              <div className="grid gap-4 sm:grid-cols-2">
                <select data-testid="employee-type-input" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as EmployeeRecord["type"] })} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                  {employeeTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <input value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} placeholder="Department" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input data-testid="employee-phone-input" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Phone" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
                <input data-testid="employee-email-input" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" type="email" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input type="number" value={form.allocatedStudents} onChange={(event) => setForm({ ...form, allocatedStudents: Number(event.target.value) })} placeholder="Allocated students" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
                <select value={form.availability} onChange={(event) => setForm({ ...form, availability: event.target.value as EmployeeRecord["availability"] })} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                  <option value="Available">Available</option>
                  <option value="Busy">Busy</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" data-testid="employee-save-button" className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  Save employee
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
