import { useEffect, useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";

import { useToast } from "../../ui/toastContext";

export default function SecurityMenu() {
  const { showToast } = useToast();
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
        data-testid="header-security-button"
        aria-label="Security"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:bg-blue-50 hover:text-blue-700"
      >
        <ShieldCheck className="h-4 w-4" />
      </button>

      {open && (
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
                setOpen(false);
              }}
              className="w-full rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Sign out other sessions
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
