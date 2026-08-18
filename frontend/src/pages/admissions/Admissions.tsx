import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useDataStore } from "../../store/dataStoreContext";
import { useToast } from "../../components/ui/toastContext";
import type { StudentRecord } from "../../data/mockData";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function Admissions() {
  const { students, updateStudentFee } = useDataStore();
  const { showToast } = useToast();
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id ?? "");
  const [search, setSearch] = useState("");

  const selectedStudent = useMemo(
    () =>
      students.find((student) => student.id === selectedStudentId) ??
      students[0],
    [students, selectedStudentId],
  );

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return students;
    return students.filter((student) =>
      [student.name, student.course, student.id, student.mobile]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [students, search]);

  const totals = useMemo(() => {
    const totalCourseFee = students.reduce((sum, student) => sum + student.fee.courseFee, 0);
    const totalPaid = students.reduce((sum, student) => sum + student.fee.amountPaid, 0);
    const totalPending = students.reduce((sum, student) => sum + student.fee.pendingAmount, 0);

    return { totalCourseFee, totalPaid, totalPending };
  }, [students]);

  const updateFee = <K extends keyof StudentRecord["fee"]>(
    field: K,
    value: StudentRecord["fee"][K],
  ) => {
    if (!selectedStudent) return;
    updateStudentFee(selectedStudent.id, { [field]: value } as Partial<StudentRecord["fee"]>);
  };

  const recordPayment = () => {
    if (!selectedStudent) return;
    showToast(`Payment updated for ${selectedStudent.name}`);
  };

  if (!selectedStudent) {
    return <div className="text-slate-500">No students yet.</div>;
  }

  return (
    <div data-testid="admissions-page" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admission & Fees</h1>
        <p className="mt-1 text-sm text-slate-500">Track final fee, payments, and outstanding balances.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Course fee</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{currency.format(totals.totalCourseFee)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Paid</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{currency.format(totals.totalPaid)}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Pending</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{currency.format(totals.totalPending)}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div data-testid="fee-ledger-card" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Student fee ledger</h2>
          </div>

          <label className="relative mt-4 block w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              data-testid="admissions-search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search students"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400"
            />
          </label>

          <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto pr-1">
            {filteredStudents.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-500">No students match.</p>
            )}
            {filteredStudents.map((student) => (
              <button data-testid={`fee-student-${student.id}`}
                key={student.id}
                type="button"
                onClick={() => setSelectedStudentId(student.id)}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${selectedStudentId === student.id ? "border-slate-900 bg-slate-100" : "border-slate-200 bg-slate-50 hover:border-slate-300"}`}
              >
                <div>
                  <p className="font-medium text-slate-900">{student.name}</p>
                  <p className="text-xs text-slate-500">{student.course}</p>
                </div>

                <span className="text-sm font-semibold text-slate-700">₹{student.fee.pendingAmount.toLocaleString("en-IN")}</span>
              </button>
            ))}
          </div>
        </div>

        <div data-testid="fee-update-card" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Update fee - {selectedStudent.name}</h2>
            <button
              type="button"
              data-testid="admissions-record-payment"
              onClick={recordPayment}
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Record payment
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-600">Course Fee</label>
              <input data-testid="admissions-course-fee-input" value={selectedStudent.fee.courseFee} onChange={(event) => updateFee("courseFee", Number(event.target.value))} type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600">Discount</label>
              <input data-testid="admissions-discount-input" value={selectedStudent.fee.discount} onChange={(event) => updateFee("discount", Number(event.target.value))} type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600">Final Fee</label>
              <input data-testid="admissions-final-fee-input" value={selectedStudent.fee.finalFee} onChange={(event) => updateFee("finalFee", Number(event.target.value))} type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600">Amount Paid</label>
              <input data-testid="admissions-amount-paid-input" value={selectedStudent.fee.amountPaid} onChange={(event) => updateFee("amountPaid", Number(event.target.value))} type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600">Pending Amount (auto)</label>
              <input data-testid="admissions-pending-amount-display" readOnly value={selectedStudent.fee.pendingAmount} type="number" className="w-full rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-500" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600">Payment Date</label>
              <input value={selectedStudent.fee.paymentDate} onChange={(event) => updateFee("paymentDate", event.target.value)} type="date" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600">Payment Mode</label>
              <select value={selectedStudent.fee.paymentMode} onChange={(event) => updateFee("paymentMode", event.target.value as StudentRecord["fee"]["paymentMode"])} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600">Next Payment Date</label>
              <input value={selectedStudent.fee.nextPaymentDate} onChange={(event) => updateFee("nextPaymentDate", event.target.value)} type="date" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-600">Payment Remarks</label>
              <textarea value={selectedStudent.fee.paymentRemarks} onChange={(event) => updateFee("paymentRemarks", event.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
