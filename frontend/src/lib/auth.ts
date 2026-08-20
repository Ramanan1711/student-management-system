// Demo-only client-side auth helpers.
// NOTE: This app has no backend authentication. In production, use HTTP-only
// cookies backed by a real auth server. Here we use sessionStorage so the
// "session" is at least tab-scoped and cleared when the tab closes.
const AUTH_KEY = "sms.auth";
const AUTH_USERNAME_KEY = "sms.auth.username";

export function login(email: string): void {
  sessionStorage.setItem(AUTH_KEY, "1");
  sessionStorage.setItem(AUTH_USERNAME_KEY, email.split("@")[0]);
}

export function logout(): void {
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_USERNAME_KEY);
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === "1";
}

export function getUsername(): string {
  return sessionStorage.getItem(AUTH_USERNAME_KEY) ?? "User";
}
