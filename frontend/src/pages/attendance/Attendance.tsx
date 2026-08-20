import { useMemo, useState } from "react";
import { useDataStore } from "../../store/dataStoreContext";
import { useToast } from "../../components/ui/toastContext";
import { getBatchName } from "../../data/mockData";

type AttendanceMark = "Present" | "Absent" | "Leave";

const markStyle: Record<AttendanceMark, string> = {
  Present: "bg-emerald-600 text-white",
  Absent: "bg-red-500 text-white",
  Leave: "bg-amber-500 text-white",
};

export default function Attendance() {
  const { students, batches: batchRecords, attendanceRecords, markAttendance } = useDataStore();
  const { showToast } = useToast();

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [batchFilter, setBatchFilter] = useState<string>("All");
  const [session, setSession] = useState<Record<string, AttendanceMark>>({});

  const batches = useMemo(() => {
    const unique = Array.from(new Set(students.map((s) => s.batchId)));
    return ["All", ...unique];
  }, [students]);

  const visibleStudents = useMemo(
    () =>
      batchFilter === "All"
        ? students
        : students.filter((s) => s.batchId === batchFilter),
    [students, batchFilter],
  );

  const totals = useMemo(() => {
    return {
      totalClasses: students.reduce((sum, s) => sum + s.attendance.totalClasses, 0),
      present: students.reduce((sum, s) => sum + s.attendance.present, 0),
      absent: students.reduce((sum, s) => sum + s.attendance.absent, 0),
      leave: students.reduce((sum, s) => sum + s.attendance.leave, 0),
    };
  }, [students]);

  const setMark = (studentId: string, mark: AttendanceMark) => {
    setSession((prev) => ({ ...prev, [studentId]: mark }));
  };

  const saveAll = () => {
    const entries = Object.entries(session);
    if (entries.length === 0) {
      showToast("Mark at least one student before saving.", "error");
      return;
    }
    const savedCount = entries.reduce((count, [studentId, mark]) => count + (markAttendance(studentId, date, mark) ? 1 : 0), 0);
    const skippedCount = entries.length - savedCount;
    if (savedCount === 0) {
      showToast(`Attendance already exists for the selected date (${date}).`, "error");
      return;
    }
    showToast(`Attendance saved for ${savedCount} student${savedCount > 1 ? "s" : ""} on ${date}${skippedCount ? `; ${skippedCount} duplicate${skippedCount > 1 ? "s" : ""} skipped` : ""}`);
    setSession({});
  };

  return (
    <div data-testid="attendance-page" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
          <p className="mt-1 text-sm text-slate-500">Mark daily attendance and monitor aggregate performance.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            data-testid="attendance-date-input"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          />
          <select
            data-testid="attendance-batch-filter"
            value={batchFilter}
            onChange={(event) => setBatchFilter(event.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
          >
            {batches.map((b) => (
              <option key={b} value={b}>{b === "All" ? "All batches" : b}</option>
            ))}
          </select>
          <button
            type="button"
            data-testid="attendance-save-button"
            onClick={saveAll}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Save attendance
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Classes", value: totals.totalClasses },
          { label: "Present", value: totals.present },
          { label: "Absent", value: totals.absent },
          { label: "Leave", value: totals.leave },
        ].map((stat) => (
          <div data-testid={`attendance-stat-${stat.label.toLowerCase().replaceAll(" ", "-")}`} key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div data-testid="attendance-table" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Batch</th>
                <th className="px-4 py-3 font-medium">Mark</th>
                <th className="px-4 py-3 font-medium">Present</th>
                <th className="px-4 py-3 font-medium">Absent</th>
                <th className="px-4 py-3 font-medium">Leave</th>
                <th className="px-4 py-3 font-medium">%</th>
              </tr>
            </thead>
            <tbody>
              {visibleStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">No students in this batch.</td>
                </tr>
              )}
              {visibleStudents.map((student) => {
                const active = session[student.id];
                const alreadyMarked = attendanceRecords.some((record) => record.studentId === student.id && record.date === date);
                return (
                  <tr key={student.id} data-testid={`attendance-row-${student.id}`} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium text-slate-900">{student.name}</td>
                    <td className="px-4 py-3 text-slate-600">{getBatchName(student.batchId, batchRecords)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(["Present", "Absent", "Leave"] as AttendanceMark[]).map((mark) => (
                          <button
                            key={mark}
                            type="button"
                            data-testid={`attendance-mark-${student.id}-${mark.toLowerCase()}`}
                            onClick={() => setMark(student.id, mark)}
                            disabled={alreadyMarked}
                            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${active === mark ? markStyle[mark] : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                          >
                            {alreadyMarked ? "Recorded" : mark}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{student.attendance.present}</td>
                    <td className="px-4 py-3 text-slate-600">{student.attendance.absent}</td>
                    <td className="px-4 py-3 text-slate-600">{student.attendance.leave}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                        {student.attendance.attendancePercentage}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
