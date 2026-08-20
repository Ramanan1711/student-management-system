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
    <div className="app-shell h-screen bg-[#eef3f9] lg:p-4">
      <div className="app-frame mx-auto flex h-screen max-w-[1500px] overflow-hidden border border-slate-200 bg-[#f4f7fb] shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:h-[calc(100vh-2rem)] lg:rounded-[24px]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen((value) => !value)} />

          <main className="app-main flex-1 overflow-y-auto bg-[#f4f7fb] p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}