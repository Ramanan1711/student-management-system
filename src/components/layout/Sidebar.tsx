import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Users,
  UserRoundPlus,
  WalletCards,
  Layers3,
  UserCog,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigation = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Student Walk-ins", path: "/walkins", icon: UserRoundPlus },
  { label: "Student Registration", path: "/registration", icon: GraduationCap },
  { label: "Students", path: "/students", icon: Users },
  { label: "Admission & Fees", path: "/admissions", icon: WalletCards },
  { label: "Batch Management", path: "/batches", icon: Layers3 },
  { label: "Employees", path: "/employees", icon: UserCog },
  { label: "Attendance", path: "/attendance", icon: ClipboardCheck },
  { label: "Class Reports", path: "/class-reports", icon: BookOpen },
  { label: "Tasks", path: "/tasks", icon: ClipboardList },
  { label: "Performance", path: "/performance", icon: BarChart3 },
  { label: "Reports", path: "/reports", icon: FileBarChart },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open = true, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col bg-[#0d6cac] text-white transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-[110px] items-center justify-between border-b border-white/10 px-5">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight">ADMIN</h1>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-blue-100/80">
              Iunoware admin
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-2">
            <button className="flex w-full items-center gap-3 rounded-xl bg-white/10 px-3 py-2 text-left text-sm font-semibold text-white shadow-sm ring-1 ring-white/10">
              <LayoutDashboard className="h-4 w-4" />
              Main Dashboard
            </button>
          </div>

          {navigation.slice(1).map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-white/12 text-white shadow-inner"
                      : "text-blue-50/80 hover:bg-white/8 hover:text-white",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="space-y-4 border-t border-white/10 p-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/15">
            <LogOut className="h-4 w-4" />
            Logout
          </button>

          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-semibold text-slate-700">
              U
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Username</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-blue-100/70">Admin</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}