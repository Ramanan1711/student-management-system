import { Bell } from "lucide-react";

import { useDataStore } from "../../../store/dataStoreContext";

export default function MobileNotificationBadge() {
  const { notifications } = useDataStore();

  return (
    <div
      data-testid="mobile-notifications-indicator"
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 ring-1 ring-slate-200"
    >
      <Bell className="h-4 w-4" />
      {notifications.length > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
          {notifications.length}
        </span>
      )}
    </div>
  );
}
