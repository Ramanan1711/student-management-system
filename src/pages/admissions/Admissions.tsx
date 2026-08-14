import { useMemo, useState } from "react";
import { students as seedStudents } from "../../data/mockData";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function Admissions() {
  const [students, setStudents] = useState(seedStudents);
  const [selectedStudentId, setSelectedStudentId] = useState(seedStudents[0].id);

  const selectedStudent = students.find((student) => student.id === selectedStudentId) ?? students[0];

  const totals = useMemo(() => {
    const totalCourseFee = students.reduce((sum, student) => sum + student.fee.courseFee, 0);
    const totalPaid = students.reduce((sum, student) => sum + student.fee.amountPaid, 0);
    const totalPending = students.reduce((sum, student) => sum + student.fee.pendingAmount, 0);

    return { totalCourseFee, totalPaid, totalPending };
  }, [students]);

  const updateSelected = (field: keyof typeof selectedStudent.fee, value: number | string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === selectedStudentId
          ? {
              ...student,
              fee: {
                ...student.fee,
                [field]: value,
              },
            }
          : student,
      ),
    );
  };

  return (
    <div className="space-y-6">
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
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Student fee ledger</h2>

          <div className="mt-4 space-y-3">
            {students.map((student) => (
              <button
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

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Update fee details</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-slate-600">Course Fee</label>
              <input value={selectedStudent.fee.courseFee} onChange={(event) => updateSelected("courseFee", Number(event.target.value))} type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600">Discount</label>
              <input value={selectedStudent.fee.discount} onChange={(event) => updateSelected("discount", Number(event.target.value))} type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600">Final Fee</label>
              <input value={selectedStudent.fee.finalFee} onChange={(event) => updateSelected("finalFee", Number(event.target.value))} type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600">Amount Paid</label>
              <input value={selectedStudent.fee.amountPaid} onChange={(event) => updateSelected("amountPaid", Number(event.target.value))} type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600">Pending Amount</label>
              <input value={selectedStudent.fee.pendingAmount} onChange={(event) => updateSelected("pendingAmount", Number(event.target.value))} type="number" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600">Payment Date</label>
              <input value={selectedStudent.fee.paymentDate} onChange={(event) => updateSelected("paymentDate", event.target.value)} type="date" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600">Payment Mode</label>
              <select value={selectedStudent.fee.paymentMode} onChange={(event) => updateSelected("paymentMode", event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm text-slate-600">Next Payment Date</label>
              <input value={selectedStudent.fee.nextPaymentDate} onChange={(event) => updateSelected("nextPaymentDate", event.target.value)} type="date" className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm text-slate-600">Payment Remarks</label>
              <textarea value={selectedStudent.fee.paymentRemarks} onChange={(event) => updateSelected("paymentRemarks", event.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}