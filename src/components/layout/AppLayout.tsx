import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handler = () => setSidebarOpen((value) => !value);
    window.addEventListener("toggle-sidebar", handler);

    return () => {
      window.removeEventListener("toggle-sidebar", handler);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#e7e5df] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex max-w-[1360px] overflow-hidden rounded-[24px] border border-slate-300 bg-[#f1f1ee] shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen((value) => !value)} />

          <main className="flex-1 bg-[#f2f1ee] p-4 sm:p-5 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}