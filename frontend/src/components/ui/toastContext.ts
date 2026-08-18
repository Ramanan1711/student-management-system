import { createContext, useContext } from "react";

export interface ToastContextValue {
  showToast: (message: string, tone?: "success" | "info" | "error") => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
