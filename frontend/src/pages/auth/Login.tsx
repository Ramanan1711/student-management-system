import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { login } from "../../lib/auth";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    login(email);

    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a1128] px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl lg:grid-cols-2">
        <div className="hidden bg-[#111d42] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">
              ACADEMY MANAGEMENT
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Student Registration &
              <br />
              Report Management
            </h1>

            <p className="mt-6 max-w-md text-sm leading-6 text-slate-300">
              Manage students, batches, attendance, training reports,
              tasks, performance and fees from one place.
            </p>
          </div>

          <p className="text-xs text-slate-500">
            Student Management System
          </p>
        </div>

        <div className="p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <div className="mb-8">
              <h2 data-testid="login-title" className="text-2xl font-bold text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to access the administration portal.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              data-testid="login-form"
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    data-testid="login-email-input"
                    placeholder="admin@example.com"
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    data-testid="login-password-input"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-10 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    data-testid="login-password-toggle"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && <p data-testid="login-error-message" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
              <button
                type="submit"
                data-testid="login-submit-button"
                className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Sign in
              </button>
            </form>

            <p className="mt-8 text-center text-xs text-slate-400">
              Demo application for developer assignment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}