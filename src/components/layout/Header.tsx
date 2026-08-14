import { Bell, Menu, Search, ShieldCheck } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-[90px] items-center justify-between border-b border-slate-200 bg-[#f1efe8] px-4 sm:px-6">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 hover:bg-slate-200 lg:hidden"
      >
        <Menu className="h-5 w-5 text-slate-700" />
      </button>

      <div className="hidden flex-1 items-center justify-between gap-4 lg:flex">
        <h1 className="text-[18px] font-semibold text-slate-800">
          Executive Overview
        </h1>

        <div className="flex items-center gap-3">
          <label className="flex w-[260px] items-center gap-2 rounded-full bg-[#f8f7f3] px-3 py-2 text-sm text-slate-500 ring-1 ring-slate-200">
            <Search className="h-4 w-4" />
            <input
              className="w-full border-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              placeholder="Search analytics..."
            />
          </label>

          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f7f3] text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200">
            <Bell className="h-4 w-4" />
          </button>

          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f7f3] text-slate-600 ring-1 ring-slate-200 hover:bg-slate-200">
            <ShieldCheck className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f7f3] text-slate-600 ring-1 ring-slate-200">
          <Bell className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}