import { useEffect, useRef, useState } from "react";
import { Bell, X } from "lucide-react";

import { useDataStore } from "../../../store/dataStoreContext";

export default function NotificationCenter() {
  const { notifications, dismissNotification } = useDataStore();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        data-testid="header-notifications-button"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
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

      {open && (
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
  );
}
