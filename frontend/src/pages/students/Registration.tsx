import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDataStore } from "../../store/DataStore";
import { useToast } from "../../components/ui/Toast";
import type { StudentRecord } from "../../data/mockData";

type NewStudent = Omit<StudentRecord, "id" | "photo">;

const emptyStudent: NewStudent = {
  name: "",
  mobile: "",
  email: "",
  dateOfBirth: "",
  gender: "Male",
  address: "",
  qualification: "",
  course: "Full Stack Development",
  courseDuration: "6 Months",
  joiningDate: new Date().toISOString().slice(0, 10),
  batch: "FS-APR-01",
  mode: "Offline",
  assignedCounsellor: "Priya",
  fee: {
    courseFee: 60000,
    discount: 5000,
    finalFee: 55000,
    amountPaid: 0,
    pendingAmount: 55000,
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMode: "UPI",
    nextPaymentDate: new Date().toISOString().slice(0, 10),
    paymentRemarks: "",
  },
  attendance: {
    totalClasses: 0,
    present: 0,
    absent: 0,
    leave: 0,
    attendancePercentage: 0,
  },
  performance: {
    technicalKnowledge: 0,
    practicalSkills: 0,
    communication: 0,
    attendance: 0,
    taskCompletion: 0,
    behaviour: 0,
    overallPerformance: 0,
  },
};

export default function Registration() {
  const { addStudent, batches } = useDataStore();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [student, setStudent] = useState<NewStudent>(emptyStudent);
  const [error, setError] = useState("");

  const updateField = <K extends keyof NewStudent>(field: K, value: NewStudent[K]) => {
    setStudent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!student.name || !student.mobile || !student.email || !student.course || !student.joiningDate) {
      setError("Name, mobile, email, course, and joining date are required.");
      return;
    }
    if (!/^\d{10}$/.test(student.mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    const created = addStudent(student);
    setStudent(emptyStudent);
    setError("");
    showToast(`${created.name} registered successfully`);
  };

  return (
    <div data-testid="registration-page" className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Student Registration</h1>
        <p className="mt-1 text-sm text-slate-500">Capture complete admission information for a new student.</p>
      </div>

      <form onSubmit={handleSubmit} data-testid="registration-form" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Student details</h2>
          <label data-testid="registration-photo-upload" className="cursor-pointer rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:border-blue-300 hover:text-blue-700">Upload photo<input type="file" accept="image/*" className="hidden" /></label>
        </div>

        {error && <p data-testid="registration-form-error" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <input data-testid="registration-name-input" value={student.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Student Name" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
          <input data-testid="registration-mobile-input" value={student.mobile} onChange={(event) => updateField("mobile", event.target.value)} placeholder="Mobile" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
          <input data-testid="registration-email-input" value={student.email} onChange={(event) => updateField("email", event.target.value)} placeholder="Email" type="email" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
          <input value={student.dateOfBirth} onChange={(event) => updateField("dateOfBirth", event.target.value)} type="date" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
          <select value={student.gender} onChange={(event) => updateField("gender", event.target.value as StudentRecord["gender"])} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input value={student.qualification} onChange={(event) => updateField("qualification", event.target.value)} placeholder="Qualification" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
          <input value={student.course} onChange={(event) => updateField("course", event.target.value)} placeholder="Course" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
          <input value={student.courseDuration} onChange={(event) => updateField("courseDuration", event.target.value)} placeholder="Course Duration" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
          <input value={student.joiningDate} onChange={(event) => updateField("joiningDate", event.target.value)} type="date" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
          <select data-testid="registration-batch-select" value={student.batch} onChange={(event) => updateField("batch", event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id}>{batch.batchName} ({batch.id})</option>
            ))}
          </select>
          <select value={student.mode} onChange={(event) => updateField("mode", event.target.value as StudentRecord["mode"])} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm">
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <input value={student.assignedCounsellor} onChange={(event) => updateField("assignedCounsellor", event.target.value)} placeholder="Assigned Counsellor" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
          <div className="md:col-span-2 xl:col-span-3">
            <textarea value={student.address} onChange={(event) => updateField("address", event.target.value)} placeholder="Address" rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Fee details</h3>

          <div className="grid gap-4 md:grid-cols-3">
            <input value={student.fee.courseFee} onChange={(event) => updateField("fee", { ...student.fee, courseFee: Number(event.target.value) })} placeholder="Course Fee" type="number" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            <input value={student.fee.discount} onChange={(event) => updateField("fee", { ...student.fee, discount: Number(event.target.value) })} placeholder="Discount" type="number" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            <input value={student.fee.finalFee} onChange={(event) => updateField("fee", { ...student.fee, finalFee: Number(event.target.value), pendingAmount: Math.max(0, Number(event.target.value) - student.fee.amountPaid) })} placeholder="Final Fee" type="number" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            <input value={student.fee.amountPaid} onChange={(event) => updateField("fee", { ...student.fee, amountPaid: Number(event.target.value), pendingAmount: Math.max(0, student.fee.finalFee - Number(event.target.value)) })} placeholder="Amount Paid" type="number" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-500">
              Pending: ₹{Math.max(0, student.fee.finalFee - student.fee.amountPaid).toLocaleString("en-IN")}
            </div>
            <input value={student.fee.paymentDate} onChange={(event) => updateField("fee", { ...student.fee, paymentDate: event.target.value })} type="date" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            data-testid="registration-view-students"
            onClick={() => navigate("/students")}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            View students
          </button>
          <button type="submit" data-testid="registration-save-button" className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
            Save registration
          </button>
        </div>
      </form>
    </div>
  );
}
