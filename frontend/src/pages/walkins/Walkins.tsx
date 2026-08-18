import { useMemo, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { useDataStore } from "../../store/dataStoreContext";
import { useToast } from "../../components/ui/toastContext";
import type { WalkinLead } from "../../data/mockData";

const leadStatuses = ["New", "Contacted", "Counselling", "Interested", "Admission", "Not Interested"];
const sources = ["Walk-in", "Website", "Google", "Instagram", "Referral"];

const initialForm: Omit<WalkinLead, "id"> = {
  studentName: "",
  mobileNumber: "",
  email: "",
  courseInterested: "",
  qualification: "",
  location: "",
  source: "Walk-in",
  counsellorName: "",
  enquiryDate: new Date().toISOString().slice(0, 10),
  remarks: "",
  followUpDate: new Date().toISOString().slice(0, 10),
  leadStatus: "New",
};

export default function Walkins() {
  const { walkins, addWalkin } = useDataStore();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | WalkinLead["leadStatus"]>("All");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filteredLeads = useMemo(() => {
    const query = search.toLowerCase();

    return walkins.filter((lead) => {
      const matchesText = [lead.studentName, lead.email, lead.courseInterested, lead.location]
        .join(" ")
        .toLowerCase()
        .includes(query);
      const matchesStatus = statusFilter === "All" || lead.leadStatus === statusFilter;
      return matchesText && matchesStatus;
    });
  }, [walkins, search, statusFilter]);

  const handleChange = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.studentName || !form.mobileNumber || !form.email || !form.courseInterested) {
      setError("Name, mobile, email, and course are required.");
      return;
    }
    if (!/^\d{10}$/.test(form.mobileNumber)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    const created = addWalkin(form);
    showToast(`Walk-in saved for ${created.studentName}`);
    setForm(initialForm);
    setError("");
    setShowForm(false);
  };

  return (
    <div data-testid="walkins-page" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Walk-ins</h1>
          <p className="mt-1 text-sm text-slate-500">Manage enquiries, counselling flow, and follow-up status.</p>
        </div>

        <button
          type="button"
          data-testid="walkins-add-button"
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Add enquiry
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Leads", value: walkins.length },
          { label: "New", value: walkins.filter((lead) => lead.leadStatus === "New").length },
          { label: "Interested", value: walkins.filter((lead) => lead.leadStatus === "Interested").length },
          { label: "Admission", value: walkins.filter((lead) => lead.leadStatus === "Admission").length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Lead pipeline</h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              data-testid="walkins-status-filter"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
            >
              <option value="All">All statuses</option>
              {leadStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <label className="relative block w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                data-testid="walkins-search-input"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search leads"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400"
              />
            </label>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-3 py-3 font-medium">Student</th>
                <th className="px-3 py-3 font-medium">Course</th>
                <th className="px-3 py-3 font-medium">Source</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Follow-up</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-sm text-slate-500">
                    No leads match your filters.
                  </td>
                </tr>
              )}
              {filteredLeads.map((lead) => (
                <tr key={lead.id} data-testid={`walkin-row-${lead.id}`} className="border-t border-slate-200">
                  <td className="px-3 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{lead.studentName}</p>
                      <p className="text-xs text-slate-500">{lead.mobileNumber}</p>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{lead.courseInterested}</td>
                  <td className="px-3 py-3 text-slate-600">{lead.source}</td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      {lead.leadStatus}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{lead.followUpDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4" onClick={() => setShowForm(false)}>
          <form
            onSubmit={handleSubmit}
            data-testid="walkin-form"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Add new enquiry</h2>
              <button
                type="button"
                data-testid="walkin-form-close"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4">
              {error && <p data-testid="walkin-form-error" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
              <input data-testid="walkin-student-name-input" value={form.studentName} onChange={(event) => handleChange("studentName", event.target.value)} placeholder="Student Name" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input data-testid="walkin-mobile-input" value={form.mobileNumber} onChange={(event) => handleChange("mobileNumber", event.target.value)} placeholder="Mobile Number" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
                <input data-testid="walkin-email-input" value={form.email} onChange={(event) => handleChange("email", event.target.value)} placeholder="Email" type="email" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input data-testid="walkin-course-input" value={form.courseInterested} onChange={(event) => handleChange("courseInterested", event.target.value)} placeholder="Course Interested" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
                <input value={form.qualification} onChange={(event) => handleChange("qualification", event.target.value)} placeholder="Qualification" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={form.location} onChange={(event) => handleChange("location", event.target.value)} placeholder="Location" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
                <select value={form.source} onChange={(event) => handleChange("source", event.target.value as WalkinLead["source"])} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400">
                  {sources.map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={form.counsellorName} onChange={(event) => handleChange("counsellorName", event.target.value)} placeholder="Counsellor Name" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
                <input value={form.enquiryDate} onChange={(event) => handleChange("enquiryDate", event.target.value)} type="date" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
              </div>
              <textarea value={form.remarks} onChange={(event) => handleChange("remarks", event.target.value)} placeholder="Remarks" rows={3} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={form.followUpDate} onChange={(event) => handleChange("followUpDate", event.target.value)} type="date" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
                <select value={form.leadStatus} onChange={(event) => handleChange("leadStatus", event.target.value as WalkinLead["leadStatus"])} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400">
                  {leadStatuses.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Cancel</button>
                <button type="submit" data-testid="walkin-save-button" className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                  Save enquiry
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
