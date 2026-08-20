import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { useDataStore } from "../../store/dataStoreContext";
import { useToast } from "../../components/ui/toastContext";
import type { EmployeeAllocation, EmployeeRecord } from "../../data/mockData";

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
  const { employees, students, batches, employeeAllocations, addEmployee, addEmployeeAllocation } = useDataStore();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<"All" | EmployeeRecord["type"]>("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialEmployee);
  const [error, setError] = useState("");
  const [allocationForm, setAllocationForm] = useState<Omit<EmployeeAllocation, "id" | "employeeId" | "assignedAt">>({ batchId: "", studentId: "" });
  const [allocationEmployeeId, setAllocationEmployeeId] = useState<string | null>(null);
  const [allocationError, setAllocationError] = useState("");

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

  const submitAllocation = (event: React.FormEvent) => {
    event.preventDefault();
    if (!allocationEmployeeId || (!allocationForm.batchId && !allocationForm.studentId)) {
      setAllocationError("Select a batch or student to create an allocation.");
      return;
    }
    const created = addEmployeeAllocation({
      employeeId: allocationEmployeeId,
      batchId: allocationForm.batchId || undefined,
      studentId: allocationForm.studentId || undefined,
      assignedAt: new Date().toISOString().slice(0, 10),
    });
    if (!created) {
      setAllocationError("This employee is already assigned to the selected target.");
      return;
    }
    showToast("Employee allocation saved");
    setAllocationForm({ batchId: "", studentId: "" });
    setAllocationError("");
    setAllocationEmployeeId(null);
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
            {(() => {
              const allocations = employeeAllocations.filter((allocation) => allocation.employeeId === employee.id);
              const allocatedStudentIds = new Set<string>();
              allocations.forEach((allocation) => {
                if (allocation.studentId) allocatedStudentIds.add(allocation.studentId);
                if (allocation.batchId) {
                  batches.find((batch) => batch.id === allocation.batchId)?.students.forEach((studentId) => allocatedStudentIds.add(studentId));
                }
              });
              return <>
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
              <p>{allocatedStudentIds.size} allocated students</p>
              <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Assignments</p>
              {allocations.length === 0 && <p className="text-xs text-slate-500">No assignments yet.</p>}
              {allocations.slice(0, 3).map((allocation) => {
                const batch = batches.find((entry) => entry.id === allocation.batchId);
                const student = students.find((entry) => entry.id === allocation.studentId);
                return <p key={allocation.id} className="text-xs text-slate-600">{batch?.batchName ?? student?.name ?? allocation.batchId ?? allocation.studentId}</p>;
              })}
            </div>
            <button type="button" data-testid={`employee-allocate-${employee.id}`} onClick={() => { setAllocationEmployeeId(employee.id); setAllocationError(""); }} className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Allocate</button>
              </>;
            })()}
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

      {allocationEmployeeId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setAllocationEmployeeId(null)}>
          <form onSubmit={submitAllocation} data-testid="employee-allocation-form" onClick={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">Allocate employee</h2><button type="button" data-testid="employee-allocation-close" onClick={() => setAllocationEmployeeId(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button></div>
            {allocationError && <p data-testid="employee-allocation-error" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{allocationError}</p>}
            <div className="grid gap-4">
              <label className="grid gap-1 text-sm font-medium text-slate-700">Batch<select data-testid="employee-allocation-batch" value={allocationForm.batchId ?? ""} onChange={(event) => setAllocationForm({ ...allocationForm, batchId: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal"><option value="">No batch assignment</option>{batches.map((batch) => <option key={batch.id} value={batch.id}>{batch.batchName} ({batch.id})</option>)}</select></label>
              <label className="grid gap-1 text-sm font-medium text-slate-700">Student<select data-testid="employee-allocation-student" value={allocationForm.studentId ?? ""} onChange={(event) => setAllocationForm({ ...allocationForm, studentId: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2.5 font-normal"><option value="">No student assignment</option>{students.map((student) => <option key={student.id} value={student.id}>{student.name} ({student.id})</option>)}</select></label>
              <p className="text-xs text-slate-500">Choose a batch, a student, or both.</p>
            </div>
            <div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setAllocationEmployeeId(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button><button type="submit" data-testid="employee-allocation-save" className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Save allocation</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
