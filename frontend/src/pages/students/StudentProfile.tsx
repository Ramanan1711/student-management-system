import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useDataStore } from "../../store/dataStoreContext";
import { getBatchName } from "../../data/mockData";

const profileTabs = [
  "Overview",
  "Registration",
  "Attendance",
  "Fee Ledger",
  "Performance",
  "Video Records",
  "Reports",
  "Tasks",
] as const;
type ProfileTab = (typeof profileTabs)[number];

export default function StudentProfile() {
  const { studentId } = useParams();
  const { students, batches, tasks, classReports, videoRecords, attendanceRecords, feeTransactions, addVideoRecord, updateVideoRecord, deleteVideoRecord } = useDataStore();
  const [activeTab, setActiveTab] = useState<ProfileTab>("Overview");
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [videoError, setVideoError] = useState("");
  const [videoForm, setVideoForm] = useState({ id: "", title: "", date: new Date().toISOString().slice(0, 10), duration: "", type: "Class recording" as "Class recording" | "Project review" | "Feedback", url: "" });
  const [showVideoForm, setShowVideoForm] = useState(false);
  const student = students.find((entry) => entry.id === studentId);

  if (!student) {
    return <div className="text-slate-500">Student not found.</div>;
  }

  const studentTasks = tasks.filter((task) => task.studentId === student.id);
  const studentReports = classReports.filter((report) =>
    report.studentIds?.length
      ? report.studentIds.includes(student.id)
      : report.batchId === student.batchId,
  );
  const studentVideos = videoRecords.filter((video) => video.studentId === student.id);
  const studentAttendance = attendanceRecords
    .filter((record) => record.studentId === student.id)
    .sort((first, second) => second.date.localeCompare(first.date));
  const studentPayments = feeTransactions.filter((transaction) => transaction.studentId === student.id).sort((first, second) => second.date.localeCompare(first.date));
  const selectedVideo = studentVideos.find((video) => video.id === selectedVideoId);
  const courseProgress = student.performance.overallPerformance;

  const tabClass = (tab: ProfileTab) =>
    `whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium ${activeTab === tab ? "border-slate-900 text-slate-900" : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"}`;

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            {student.photo ? <img src={student.photo} alt={`${student.name} profile`} className="h-16 w-16 rounded-full object-cover" /> : <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">{student.name.slice(0, 1)}</div>}
            <div><h2 className="text-xl font-bold text-slate-900">{student.name}</h2><p className="text-sm text-slate-500">{student.id}</p></div>
          </div>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Mobile</dt><dd className="font-medium text-slate-900">{student.mobile}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Email</dt><dd className="font-medium text-slate-900">{student.email}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Counsellor</dt><dd className="font-medium text-slate-900">{student.assignedCounsellor}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-slate-500">Mode</dt><dd className="font-medium text-slate-900">{student.mode}</dd></div>
          </dl>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Journey snapshot</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {[
              ["Classes completed", String(student.attendance.totalClasses)],
              ["Classes pending", "18"],
              ["Fee paid", `₹${student.fee.amountPaid.toLocaleString("en-IN")}`],
              ["Fee pending", `₹${student.fee.pendingAmount.toLocaleString("en-IN")}`],
            ].map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-900">{value}</p></div>)}
          </div>
        </div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <HistoryPreview title="Latest class reports" empty="No class reports recorded yet." items={studentReports.slice(0, 3).map((report) => ({ title: report.topic, detail: report.description, date: report.date }))} />
        <HistoryPreview title="Latest tasks" empty="No tasks assigned yet." items={studentTasks.slice(0, 3).map((task) => ({ title: task.title, detail: task.status, date: `Due ${task.dueDate}` }))} />
      </div>
    </div>
  );

  const renderRegistration = () => <InfoSection title="Registration & course details" items={[["Student ID", student.id], ["Qualification", student.qualification], ["Date of birth", student.dateOfBirth], ["Joining date", student.joiningDate], ["Course", student.course], ["Duration", student.courseDuration], ["Batch", getBatchName(student.batchId, batches)], ["Address", student.address]]} />;
  const renderAttendance = () => (
    <div className="space-y-6">
      <InfoSection title="Attendance summary" items={[["Total classes", String(student.attendance.totalClasses)], ["Present", String(student.attendance.present)], ["Absent", String(student.attendance.absent)], ["Leave", String(student.attendance.leave)], ["Attendance", `${student.attendance.attendancePercentage}%`]]} />
      <HistoryPreview title="Date-based attendance history" empty="No dated attendance records yet." items={studentAttendance.map((record) => ({ title: record.date, detail: record.status, date: record.status }))} />
    </div>
  );
  const renderFees = () => (
    <div className="space-y-6">
      <InfoSection title="Fee summary" items={[["Course fee", `₹${student.fee.courseFee.toLocaleString("en-IN")}`], ["Discount", `₹${student.fee.discount.toLocaleString("en-IN")}`], ["Final fee", `₹${student.fee.finalFee.toLocaleString("en-IN")}`], ["Amount paid", `₹${student.fee.amountPaid.toLocaleString("en-IN")}`], ["Pending amount", `₹${student.fee.pendingAmount.toLocaleString("en-IN")}`], ["Next payment", student.fee.nextPaymentDate]]} />
      <HistoryPreview title="Payment history" empty="No payment transactions recorded yet." items={studentPayments.map((payment) => ({ title: `₹${payment.amount.toLocaleString("en-IN")}`, detail: `${payment.paymentMode}${payment.remarks ? ` · ${payment.remarks}` : ""}`, date: payment.date }))} />
    </div>
  );
  const renderPerformance = () => <InfoSection title="Performance metrics" items={Object.entries(student.performance).map(([label, value]) => [label.replace(/([A-Z])/g, " $1"), `${value}%`])} />;
  const renderVideos = () => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-semibold text-slate-900">Video and class records</h3><button type="button" data-testid="student-video-add" onClick={() => { setVideoForm({ id: "", title: "", date: new Date().toISOString().slice(0, 10), duration: "", type: "Class recording", url: "" }); setVideoError(""); setShowVideoForm(true); }} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Add video</button></div>
      <div className="mt-4 space-y-3">
        {studentVideos.length === 0 && <p className="text-sm text-slate-500">No video records available yet.</p>}
        {studentVideos.map((video) => (
          <div key={video.id} className="flex flex-col gap-3 rounded-xl bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-medium text-slate-900">{video.title}</p><p className="mt-1 text-sm text-slate-600">{video.type} · {video.duration} · {video.date}</p></div>
            <div className="flex flex-wrap gap-2"><button type="button" data-testid={`student-video-${video.id}`} onClick={() => { setVideoError(""); setSelectedVideoId(video.id); }} className="text-sm font-semibold text-blue-700 hover:text-blue-900">Open recording</button><button type="button" data-testid={`student-video-edit-${video.id}`} onClick={() => { setVideoForm(video); setVideoError(""); setShowVideoForm(true); }} className="text-sm font-semibold text-slate-700">Edit</button><button type="button" data-testid={`student-video-delete-${video.id}`} onClick={() => { if (window.confirm(`Delete ${video.title}?`)) deleteVideoRecord(video.id); }} className="text-sm font-semibold text-red-700">Delete</button></div>
          </div>
        ))}
      </div>
    </div>
  );
  const renderReports = () => <HistoryPreview title="Class report history" empty="No class reports recorded yet." items={studentReports.map((report) => ({ title: report.topic, detail: `${report.module} · ${report.studentPerformance}`, date: report.date }))} />;
  const renderTasks = () => <HistoryPreview title="Assigned tasks" empty="No tasks assigned yet." items={studentTasks.map((task) => ({ title: task.title, detail: `${task.priority} · ${task.status}`, date: `Due ${task.dueDate}` }))} />;

  const tabContent = { Overview: renderOverview, Registration: renderRegistration, Attendance: renderAttendance, "Fee Ledger": renderFees, Performance: renderPerformance, "Video Records": renderVideos, Reports: renderReports, Tasks: renderTasks }[activeTab]();

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
          { label: "Batch", value: getBatchName(student.batchId, batches) },
          { label: "Course Progress", value: `${courseProgress}%` },
          { label: "Attendance", value: `${student.attendance.attendancePercentage}%` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex min-w-max px-2" role="tablist" aria-label="Student profile history">
          {profileTabs.map((tab) => <button key={tab} type="button" role="tab" aria-selected={activeTab === tab} onClick={() => setActiveTab(tab)} className={tabClass(tab)}>{tab}</button>)}
        </div>
      </div>

      <div data-testid={`student-profile-tab-${activeTab.toLowerCase().replaceAll(" ", "-")}`}>{tabContent}</div>

      {selectedVideo && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/60 p-4" onClick={() => setSelectedVideoId(null)}>
          <div data-testid="student-video-player" className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div><h2 className="text-lg font-semibold text-slate-900">{selectedVideo.title}</h2><p className="text-sm text-slate-500">{selectedVideo.type} · {selectedVideo.date}</p></div>
              <button type="button" data-testid="student-video-close" onClick={() => setSelectedVideoId(null)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close</button>
            </div>
            <video controls autoPlay className="w-full rounded-xl bg-slate-950" src={selectedVideo.url} onError={() => setVideoError("This recording is unavailable or could not be loaded.")}>
              Your browser does not support video playback.
            </video>
            {videoError && <p data-testid="student-video-error" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{videoError}</p>}
          </div>
        </div>
      )}

      {showVideoForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" onClick={() => setShowVideoForm(false)}>
          <form data-testid="student-video-form" onSubmit={(event) => { event.preventDefault(); if (!videoForm.title || !videoForm.url) { setVideoError("Title and video file are required."); return; } if (videoForm.id) updateVideoRecord(videoForm.id, videoForm); else addVideoRecord({ ...videoForm, studentId: student.id }); setShowVideoForm(false); }} onClick={(event) => event.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-slate-900">{videoForm.id ? "Edit video record" : "Add video record"}</h2><button type="button" data-testid="student-video-form-close" onClick={() => setShowVideoForm(false)} className="rounded-lg p-2 text-slate-500"><X className="h-4 w-4" /></button></div>
            {videoError && <p data-testid="student-video-form-error" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{videoError}</p>}
            <div className="grid gap-4"><input data-testid="student-video-title" value={videoForm.title} onChange={(event) => setVideoForm({ ...videoForm, title: event.target.value })} placeholder="Video title" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /><input data-testid="student-video-date" type="date" value={videoForm.date} onChange={(event) => setVideoForm({ ...videoForm, date: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /><input value={videoForm.duration} onChange={(event) => setVideoForm({ ...videoForm, duration: event.target.value })} placeholder="Duration (e.g. 35 min)" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /><select value={videoForm.type} onChange={(event) => setVideoForm({ ...videoForm, type: event.target.value as typeof videoForm.type })} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm"><option>Class recording</option><option>Project review</option><option>Feedback</option></select><label className="rounded-lg border border-dashed border-slate-300 px-3 py-3 text-sm text-slate-600">{videoForm.url ? "Change video file" : "Upload video file"}<input data-testid="student-video-file" type="file" accept="video/*" className="mt-2 block w-full text-xs" onChange={(event) => { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith("video/")) { setVideoError("Please select a video file."); return; } if (file.size > 25 * 1024 * 1024) { setVideoError("Video must be smaller than 25 MB."); return; } const reader = new FileReader(); reader.onload = () => setVideoForm((prev) => ({ ...prev, url: typeof reader.result === "string" ? reader.result : "" })); reader.readAsDataURL(file); }} /></label></div>
            <div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setShowVideoForm(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button><button type="submit" data-testid="student-video-save" className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Save video</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

function InfoSection({ title, items }: { title: string; items: string[][] }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-lg font-semibold text-slate-900">{title}</h3><div className="mt-4 grid gap-4 sm:grid-cols-2">{items.map(([label, value]) => <div key={label} className="rounded-xl bg-slate-50 p-3"><p className="text-xs capitalize text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-900">{value}</p></div>)}</div></div>;
}

function HistoryPreview({ title, empty, items }: { title: string; empty: string; items: { title: string; detail: string; date: string }[] }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><h3 className="text-lg font-semibold text-slate-900">{title}</h3><div className="mt-4 space-y-3">{items.length === 0 && <p className="text-sm text-slate-500">{empty}</p>}{items.map((item) => <div key={`${item.title}-${item.date}`} className="rounded-xl bg-slate-50 p-3"><div className="flex items-center justify-between gap-3"><p className="font-medium text-slate-900">{item.title}</p><span className="text-xs text-slate-500">{item.date}</span></div><p className="mt-1 text-sm text-slate-600">{item.detail}</p></div>)}</div></div>;
}