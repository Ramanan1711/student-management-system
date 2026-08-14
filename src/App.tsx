import { Users, UserPlus, Layers3, IndianRupee } from "lucide-react";

const stats = [
  {
    title: "Total Students",
    value: "248",
    icon: Users,
  },
  {
    title: "New Walk-ins",
    value: "32",
    icon: UserPlus,
  },
  {
    title: "Active Batches",
    value: "14",
    icon: Layers3,
  },
  {
    title: "Fees Collected",
    value: "₹8.42L",
    icon: IndianRupee,
  },
];

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Student Management System
            </h1>
            <p className="text-sm text-slate-500">
              Academy Administration Portal
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            A
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Dashboard
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Overview of student registration and academy activities.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-100 p-3">
                    <Icon className="h-5 w-5 text-slate-700" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Welcome
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            The Student Registration & Report Management System is
            ready for development.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;