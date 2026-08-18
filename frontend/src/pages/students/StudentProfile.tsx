import { Link, useParams } from "react-router-dom";
import { useDataStore } from "../../store/DataStore";

export default function StudentProfile() {
  const { studentId } = useParams();
  const { students, tasks, classReports } = useDataStore();
  const student = students.find((entry) => entry.id === studentId) ?? students[0];

  if (!student) {
    return <div className="text-slate-500">Student not found.</div>;
  }

  const studentTasks = tasks.filter((task) => task.studentId === student.id);
  const studentReports = classReports.filter((report) => report.batch === student.batch);

  return (
    <div data-testid="student-profile-page" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Detailed profile, course, fee, and report history.</p>
        </div>

        <Link data-testid="student-profile-back-link" to="/students" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700">
          Back to list
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Course", value: student.course },
          { label: "Batch", value: student.batch },
          { label: "Course Progress", value: "68%" },
          { label: "Attendance", value: `${student.attendance.attendancePercentage}%` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
              {student.name.slice(0, 1)}
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
              <p className="text-sm text-slate-500">{student.id}</p>
            </div>
          </div>

          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Mobile</dt><dd className="font-medium text-slate-900">{student.mobile}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Email</dt><dd className="font-medium text-slate-900">{student.email}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Course</dt><dd className="font-medium text-slate-900">{student.course}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Counsellor</dt><dd className="font-medium text-slate-900">{student.assignedCounsellor}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Mode</dt><dd className="font-medium text-slate-900">{student.mode}</dd></div>
          </dl>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Registration & course details</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Qualification</p><p className="mt-1 font-semibold text-slate-900">{student.qualification}</p></div>
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Joining date</p><p className="mt-1 font-semibold text-slate-900">{student.joiningDate}</p></div>
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Duration</p><p className="mt-1 font-semibold text-slate-900">{student.courseDuration}</p></div>
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Address</p><p className="mt-1 font-semibold text-slate-900">{student.address}</p></div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Fee details</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Course fee</p><p className="mt-1 font-semibold text-slate-900">₹{student.fee.courseFee.toLocaleString("en-IN")}</p></div>
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Discount</p><p className="mt-1 font-semibold text-slate-900">₹{student.fee.discount.toLocaleString("en-IN")}</p></div>
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Paid</p><p className="mt-1 font-semibold text-slate-900">₹{student.fee.amountPaid.toLocaleString("en-IN")}</p></div>
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Pending</p><p className="mt-1 font-semibold text-slate-900">₹{student.fee.pendingAmount.toLocaleString("en-IN")}</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Tasks</h3>
          <div className="mt-4 space-y-3">
            {studentTasks.length === 0 && (
              <p className="text-sm text-slate-500">No tasks assigned yet.</p>
            )}
            {studentTasks.map((task) => (
              <div key={task.id} className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{task.title}</p>
                    <p className="text-xs text-slate-500">Due: {task.dueDate}</p>
                  </div>
                  <span className="rounded-full bg-slate-200 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700">{task.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Class reports</h3>
          <div className="mt-4 space-y-3">
            {studentReports.slice(0, 3).map((report) => (
              <div key={report.id} className="rounded-xl bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">{report.topic}</p>
                  <span className="text-xs text-slate-500">{report.date}</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{report.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}