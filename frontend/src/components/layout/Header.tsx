import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

import GlobalSearch from "./header/GlobalSearch";
import NotificationCenter from "./header/NotificationCenter";
import SecurityMenu from "./header/SecurityMenu";
import MobileNotificationBadge from "./header/MobileNotificationBadge";

interface HeaderProps {
  onMenuClick: () => void;
}

const ROUTE_TITLE: Record<string, string> = {
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

function useRouteTitle() {
  const { pathname } = useLocation();
  return useMemo(() => {
    if (pathname.startsWith("/students/") && pathname !== "/students") {
      return "Student Profile";
    }
    return ROUTE_TITLE[pathname] ?? "Dashboard";
  }, [pathname]);
}

export default function Header({ onMenuClick }: HeaderProps) {
  const title = useRouteTitle();

  return (
    <header className="sticky top-0 z-20 flex h-[78px] items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-6">
      <button
        onClick={onMenuClick}
        data-testid="header-menu-button"
        className="rounded-lg p-2 hover:bg-slate-200 lg:hidden"
      >
        <Menu className="h-5 w-5 text-slate-700" />
      </button>

      <div className="hidden flex-1 items-center justify-between gap-4 lg:flex">
        <h1 data-testid="header-title" className="text-[18px] font-semibold text-slate-900">
          {title}
        </h1>

        <div className="flex items-center gap-3">
          <GlobalSearch />
          <NotificationCenter />
          <SecurityMenu />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3 lg:hidden">
        <MobileNotificationBadge />
      </div>
    </header>
  );
}
