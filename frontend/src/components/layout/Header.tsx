import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, Search, ShieldCheck, X } from "lucide-react";

import { useDataStore } from "../../store/DataStore";
import { useToast } from "../ui/Toast";

interface HeaderProps {
  onMenuClick: () => void;
}

const routeTitle: Record<string, string> = {
  "/dashboard": "Executive Overview",
  "/walkins": "Student Walk-ins",
  "/registration": "Student Registration",
  "/students": "Students",
  "/admissions": "Admission & Fees",
  "/batches": "Batch Management",
  "/employees": "Employees & Trainers",
  "/attendance": "Attendance",
  "/class-reports": "Class Reports",
  "/tasks": "Tasks",
  "/performance": "Performance",
  "/reports": "Reports",
};

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { students, walkins, notifications, dismissNotification } =
    useDataStore();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const title = useMemo(() => {
    if (location.pathname.startsWith("/students/") && location.pathname !== "/students") {
      return "Student Profile";
    }
    return routeTitle[location.pathname] ?? "Dashboard";
  }, [location.pathname]);

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return [] as { id: string; label: string; sublabel: string; path: string }[];
    const s = students
      .filter((student) =>
        [student.name, student.course, student.batch, student.mobile, student.email]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
      .slice(0, 5)
      .map((student) => ({
        id: student.id,
        label: student.name,
        sublabel: `${student.course} · ${student.id}`,
        path: `/students/${student.id}`,
      }));
    const w = walkins
      .filter((lead) =>
        [lead.studentName, lead.courseInterested, lead.email]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
      .slice(0, 3)
      .map((lead) => ({
        id: lead.id,
        label: lead.studentName,
        sublabel: `Walk-in · ${lead.courseInterested}`,
        path: `/walkins`,
      }));
    return [...s, ...w];
  }, [search, students, walkins]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setShowResults(false);
        setShowNotifications(false);
        setShowSecurity(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-[78px] items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-6">
      <button
        onClick={onMenuClick}
        data-testid="header-menu-button"
        className="rounded-lg p-2 hover:bg-slate-200 lg:hidden"
      >
        <Menu className="h-5 w-5 text-slate-700" />
      </button>

      <div className="hidden flex-1 items-center justify-between gap-4 lg:flex" ref={containerRef}>
        <h1 data-testid="header-title" className="text-[18px] font-semibold text-slate-900">
          {title}
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <label className="flex w-[260px] items-center gap-2 rounded-full bg-[#f8f7f3] px-3 py-2 text-sm text-slate-500 ring-1 ring-slate-200">
              <Search className="h-4 w-4" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setShowResults(true);
                }}
                onFocus={() => setShowResults(true)}
                className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="Search students, walk-ins..."
                data-testid="global-search-input"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setShowResults(false);
                  }}
                  data-testid="global-search-clear"
                  className="rounded-full p-0.5 text-slate-400 hover:text-slate-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </label>

            {showResults && search && (
              <div
                data-testid="global-search-results"
                className="absolute right-0 mt-2 w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
              >
                {results.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-slate-500">No matches found</p>
                ) : (
                  results.map((item) => (
                    <button
                      key={`${item.path}-${item.id}`}
                      type="button"
                      data-testid={`global-search-result-${item.id}`}
                      onClick={() => {
                        setSearch("");
                        setShowResults(false);
                        navigate(item.path);
                      }}
                      className="flex w-full flex-col items-start gap-0.5 border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 last:border-b-0"
                    >
                      <span className="text-sm font-semibold text-slate-800">{item.label}</span>
                      <span className="text-xs text-slate-500">{item.sublabel}</span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              data-testid="header-notifications-button"
              aria-label="Notifications"
              onClick={() => {
                setShowNotifications((v) => !v);
                setShowSecurity(false);
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <span
                  data-testid="header-notifications-count"
                  className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white"
                >
                  {notifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                data-testid="notifications-dropdown"
                className="absolute right-0 mt-2 w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
              >
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">Notifications</p>
                </div>
                <div className="max-h-[320px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-4 text-sm text-slate-500">You're all caught up.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        data-testid={`notification-${n.id}`}
                        className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-slate-50"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                          <p className="truncate text-xs text-slate-500">{n.description}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">{n.time}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => dismissNotification(n.id)}
                          data-testid={`notification-dismiss-${n.id}`}
                          className="rounded-md p-1 text-slate-400 hover:text-slate-700"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              data-testid="header-security-button"
              aria-label="Security"
              onClick={() => {
                setShowSecurity((v) => !v);
                setShowNotifications(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <ShieldCheck className="h-4 w-4" />
            </button>

            {showSecurity && (
              <div
                data-testid="security-dropdown"
                className="absolute right-0 mt-2 w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
              >
                <div className="border-b border-slate-100 px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">Security</p>
                </div>
                <div className="space-y-3 px-4 py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Two-factor auth</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">Active</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Session</span>
                    <span className="text-xs text-slate-500">Encrypted</span>
                  </div>
                  <button
                    type="button"
                    data-testid="security-logout-all"
                    onClick={() => {
                      showToast("Signed out of all other sessions");
                      setShowSecurity(false);
                    }}
                    className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                  >
                    Sign out other sessions
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3 lg:hidden">
        <div data-testid="mobile-notifications-indicator" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 ring-1 ring-slate-200">
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {notifications.length}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
