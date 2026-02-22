# Production Readiness Review

## Executive Summary

This Next.js project uses App Router with static export (`output: 'export'`) for Capacitor. The review covers architecture, performance, API layer, security, loading/UX, state management, production config, code quality, and **authorization handling**.

---

## Critical Issues (Must Fix)

### 1. **Authorization / Auth Guard** ✅ FIXED

**Issue:** Unauthenticated users could access dashboard, manage-users, services, paybill, support, line-details.

**Fix implemented:**
- `hooks/useAuthGuard.ts` – Client-side auth check, redirects unauthenticated users to `/login`
- `components/auth/AuthGuard.tsx` – Wraps `(main)` layout, shows loading while checking
- All protected routes (`/dashboard`, `/manage-users`, `/services`, `/paybill`, `/support`, `/line-details`, `/account`, `/line-details`) now redirect to `/login` when not logged in

**Note:** With `output: 'export'`, middleware does not run. Client-side guards are required.

### 2. **Auth-Changed Event Handling**

**Issue:** `auth-changed` is fired by axios 401/403 interceptor, but `AuthContext` does not listen to it. Token state can become stale.

**Recommendation:** Add listener in `AuthProvider`:

```tsx
useEffect(() => {
  const handleAuthChanged = () => {
    const token = accountService.getAccessToken();
    setToken(token);
  };
  window.addEventListener("auth-changed", handleAuthChanged);
  return () => window.removeEventListener("auth-changed", handleAuthChanged);
}, []);
```

### 3. **Temp Files in Repo**

**Issue:** `temp/` folder contains reference designs (Login, dashboaard, ghad, gjko, etc.) which may bloat build and confuse structure.

**Recommendation:** Move to `docs/` or `reference/`, or add `temp/` to `.gitignore` if not needed in production build.

---

## Important Improvements

### 4. **API Layer – Retry Strategy**

**Current:** No retry logic for failed requests.

**Recommendation:** Add retry for transient errors (503, network):

```ts
// Example: axios-retry or custom interceptor
axiosRetry(axiosClient, {
  retries: 2,
  retryCondition: (e) => e?.response?.status === 503 || !e?.response,
  retryDelay: (retryCount) => retryCount * 1000,
});
```

### 5. **API Layer – Timeout Handling**

**Current:** 60s timeout; no per-request override or user feedback.

**Recommendation:**
- Lower timeout for fast endpoints (e.g. 15s)
- Add user-facing message on timeout (e.g. toast)

### 6. **Error Boundaries**

**Current:** No app-level `error.tsx` or error boundary.

**Recommendation:** Add `app/error.tsx` and `app/(main)/error.tsx`:

```tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <button onClick={reset} className="mt-4 px-4 py-2 bg-primary text-white rounded">
        Try again
      </button>
    </div>
  );
}
```

### 7. **Loading / Suspense Consistency**

**Current:** Skeletons used in several places; no Suspense boundaries.

**Recommendation:** Add Suspense around lazy-loaded sections where appropriate; ensure all async data paths show skeletons or loading UI.

### 8. **Token Storage – httpOnly Alternative**

**Current:** Token stored in localStorage (`ACCESS_LITE_TOK_EN`).

**Risk:** XSS can read token from localStorage.

**Recommendation:** For web-only builds, consider httpOnly cookies via a backend. For Capacitor, localStorage is common; rely on secure WebView config and CSP.

---

## Optional Enhancements

### 9. **Bundle Size / Dynamic Imports**

- Lazy-load heavy components (e.g. Framer Motion in modals, chart libs)
- Example: `const BillingWidget = dynamic(() => import("@/components/dashboard/BillingWidget"), { ssr: false });`

### 10. **Memoization**

- Memoize list items in ServiceList, AccountList with `React.memo` where re-renders are costly
- Use `useMemo` for derived data (e.g. filtered accounts, mapped services)

### 11. **Logging Strategy**

- Replace `console.error`/`console.warn` with a logger (e.g. Sentry, LogRocket)
- Env-based log levels (e.g. `NODE_ENV === "production"` → only errors)

### 12. **Environment Variables Validation**

- Validate required env vars at startup (e.g. `NEXT_PUBLIC_OPCO`, API base URL)
- Fail fast if missing in production

### 13. **Next.js Config Optimization**

```ts
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true }, // Required for static export
  // Add:
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
};
```

---

## Security Checklist

| Item | Status |
|------|--------|
| Token in localStorage | ⚠️ Acceptable for Capacitor; XSS risk on web |
| API keys in env | ✅ `NEXT_PUBLIC_*` only for client-safe keys |
| 401/403 → logout | ✅ Handled in axios interceptor |
| Exempt paths (reset, forgot) | ✅ Correct |
| Sensitive data in logs | ⚠️ Ensure no token/user data in prod logs |

---

## State Management

- **7 contexts** – Config, Locale, Layout, Auth, Account, Service, Toast
- **Provider stack** – Order is correct; AuthProvider wraps AccountProvider
- **Prop drilling** – Minimal; contexts used appropriately
- **Memory leaks** – Ensure `useEffect` cleanups (listeners, timers) are in place

---

## Code Quality

| Issue | Location | Suggestion |
|-------|----------|------------|
| Large files | `useLoginFlow.ts` (351), `services/page.tsx` (268) | Split into smaller hooks/modules |
| `any` usage | Temp files | Remove or type; avoid in production |
| Duplicate BFE headers | `axiosClient` vs `requestInterceptor` | Consolidate into one source |
| Event-based patterns | `auth-changed`, `default-account-changed` | Document; consider context updates |

---

## Authorization Flow (Current)

1. Splash (`/`) → `/login`
2. Login + OTP → `/fetch-permission`
3. Fetch permission success → `/dashboard`
4. **AuthGuard** (in `(main)` layout):
   - If not logged in and on protected path → `/login`
   - If logged in and on `/login` → `/dashboard`
   - Otherwise render children

**Protected paths:** `/dashboard`, `/manage-users`, `/services`, `/paybill`, `/support`, `/line-details`, `/account`

---

## Refactored Example: AuthContext + auth-changed

```tsx
// context/AuthContext.tsx - add inside AuthProvider
useEffect(() => {
  const handleAuthChanged = () => {
    const token = accountService.getAccessToken();
    setToken(token);
  };
  window.addEventListener("auth-changed", handleAuthChanged);
  return () => window.removeEventListener("auth-changed", handleAuthChanged);
}, []);
```

---

## Summary

| Category | Critical | Important | Optional |
|----------|----------|-----------|----------|
| Auth/Authorization | ✅ Fixed | Auth-changed sync | - |
| API Layer | - | Retry, timeout UX | - |
| Error Handling | - | Error boundaries | - |
| Security | - | httpOnly (web) | - |
| Performance | - | - | Dynamic imports, memo |
| Config | - | - | next.config tweaks |
| Code Quality | Temp cleanup | - | Split large files |
