import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  FileBarChart,
  GraduationCap,
  LayoutDashboard,
  Users,
  UserRoundPlus,
  WalletCards,
  Layers3,
  UserCog,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigation = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Student Walk-ins",
    path: "/walkins",
    icon: UserRoundPlus,
  },
  {
    label: "Student Registration",
    path: "/registration",
    icon: GraduationCap,
  },
  {
    label: "Students",
    path: "/students",
    icon: Users,
  },
  {
    label: "Admission & Fees",
    path: "/admissions",
    icon: WalletCards,
  },
  {
    label: "Batch Management",
    path: "/batches",
    icon: Layers3,
  },
  {
    label: "Employees",
    path: "/employees",
    icon: UserCog,
  },
  {
    label: "Attendance",
    path: "/attendance",
    icon: ClipboardCheck,
  },
  {
    label: "Class Reports",
    path: "/class-reports",
    icon: BookOpen,
  },
  {
    label: "Tasks",
    path: "/tasks",
    icon: ClipboardList,
  },
  {
    label: "Performance",
    path: "/performance",
    icon: BarChart3,
  },
  {
    label: "Reports",
    path: "/reports",
    icon: FileBarChart,
  },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  open = true,
  onClose,
}: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r bg-white transition-transform
          lg:static lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex h-16 items-center justify-between border-b px-5">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Academy LMS
            </h1>

            <p className="text-xs text-slate-500">
              Management Portal
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 rounded-lg px-3 py-2.5",
                    "text-sm font-medium transition",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")
                }
              >
                <Icon className="h-5 w-5 shrink-0" />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <div className="rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">
              Logged in as
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-900">
              Administrator
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}