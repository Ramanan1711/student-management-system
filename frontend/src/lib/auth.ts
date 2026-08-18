// Demo-only client-side auth helpers.
// NOTE: This app has no backend authentication. In production, use HTTP-only
// cookies backed by a real auth server. Here we use sessionStorage so the
// "session" is at least tab-scoped and cleared when the tab closes.
const AUTH_KEY = "sms.auth";

export function login(): void {
  sessionStorage.setItem(AUTH_KEY, "1");
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === "1";
}
