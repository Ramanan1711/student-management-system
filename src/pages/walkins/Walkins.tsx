import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { walkinLeads, type WalkinLead } from "../../data/mockData";

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
  const [leads, setLeads] = useState<WalkinLead[]>(walkinLeads);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);

  const filteredLeads = useMemo(() => {
    const query = search.toLowerCase();

    return leads.filter((lead) =>
      [lead.studentName, lead.email, lead.courseInterested, lead.location]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [leads, search]);

  const handleChange = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextLead: WalkinLead = {
      ...form,
      id: `WL-${new Date().getFullYear()}-${String(leads.length + 1).padStart(3, "0")}`,
    };

    setLeads((prev) => [nextLead, ...prev]);
    setForm(initialForm);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Student Walk-ins</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage enquiries, counselling flow, and follow-up status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Leads", value: leads.length },
          { label: "New", value: leads.filter((lead) => lead.leadStatus === "New").length },
          { label: "Interested", value: leads.filter((lead) => lead.leadStatus === "Interested").length },
          { label: "Admission", value: leads.filter((lead) => lead.leadStatus === "Admission").length },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Lead pipeline</h2>

            <label className="relative block w-full max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search leads"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-slate-400"
              />
            </label>
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
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-t border-slate-200">
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

        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Add new enquiry</h2>

          <div className="mt-4 grid gap-4">
            <input value={form.studentName} onChange={(event) => handleChange("studentName", event.target.value)} placeholder="Student Name" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={form.mobileNumber} onChange={(event) => handleChange("mobileNumber", event.target.value)} placeholder="Mobile Number" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
              <input value={form.email} onChange={(event) => handleChange("email", event.target.value)} placeholder="Email" type="email" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <input value={form.courseInterested} onChange={(event) => handleChange("courseInterested", event.target.value)} placeholder="Course Interested" className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400" />
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
            <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">
              Save enquiry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}