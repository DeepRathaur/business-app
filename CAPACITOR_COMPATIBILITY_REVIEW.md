# Capacitor (Android/iOS WebView) Compatibility Review

## 1. Build Compatibility ✅

| Check | Status | Notes |
|-------|--------|-------|
| `output: "export"` | ✅ | `next.config.ts` uses static export; outputs to `out/` |
| No Next.js server runtime | ✅ | Static HTML/JS only; no `next start` in Capacitor |
| No API routes | ✅ | No `app/**/route.ts` or `pages/api/` |
| No SSR-only at runtime | ✅ | All pages render at build time; no `getServerSideProps` |

## 2. Node API Usage ✅

| Check | Status | Notes |
|-------|--------|-------|
| `fs`, `path`, `process.cwd()` in source | ✅ | None in app source; only in `.next/` (build output) and `node_modules` |
| `server-only` modules | ✅ | None imported |
| Server-only logic | ✅ | Config/locale fetch via axios; no server APIs |

**Note:** `fs`/`path`/`process.cwd()` appear in `.next/` and node_modules only. These run at **build time** (Node.js). The exported `out/` bundle runs in the WebView and contains no Node APIs.

## 3. API Layer ✅

| Check | Status | Notes |
|-------|--------|-------|
| fetch/axios | ✅ | `axiosClient` for all API calls |
| No server middleware | ✅ | No `middleware.ts`; `output: 'export'` disables middleware |
| CORS handling | ⚠️ | Backend must allow Capacitor origin (`capacitor://localhost` or `https://localhost`) |
| No hardcoded localhost | ✅ | No hardcoded localhost in app source; API base from `NEXT_PUBLIC_*` |

**Production requirement:** Set `NEXT_PUBLIC_API_BASE_URL` or `NEXT_PUBLIC_PROJECT_PREFIX` at build. Default fallback `https://api.example.com` is a placeholder and will fail in production.

## 4. Environment Variables ⚠️

| Check | Status | Notes |
|-------|--------|-------|
| NEXT_PUBLIC_* for frontend | ✅ | API base, BFE keys, opco, product, etc. |
| Base URL works in mobile WebView | ⚠️ | API must be reachable from device; avoid `http://localhost` in production |

**Required env vars for production Android build:**

- `NEXT_PUBLIC_API_BASE_URL` or `NEXT_PUBLIC_PROJECT_PREFIX` (API base)
- `NEXT_PUBLIC_IS_PROD` (`true` for prod)
- `NEXT_PUBLIC_OPCO`, `NEXT_PUBLIC_PRODUCT`
- BFE keys: `NEXT_PUBLIC_BFE_PROD_*` or `NEXT_PUBLIC_BFE_UAT_*` (BFE_A_K, SERVICE_ID, X_APP_VERSION, X_CLIENT_ID, X_GROUP_CODE, X_CHANNEL_CODE)
- `NEXT_PUBLIC_DEFAULT_LANGUAGE`, `NEXT_PUBLIC_ENABLE_UMS2`, `NEXT_PUBLIC_ENCRYPTION`

## 5. Assets & Images ✅

| Check | Status | Notes |
|-------|--------|-------|
| `next/image` | ✅ | With `images: { unoptimized: true }` for static export |
| Static assets | ✅ | `/images/`, `/fonts/` under `public/`; copied to `out/` |
| No absolute domain dependency | ✅ | Paths are relative (`/images/...`); resolve against app origin |

Capacitor copies `out/` to `webDir`. Relative paths resolve against `capacitor://localhost` or `https://localhost` as needed.

## 6. Routing ✅

| Check | Status | Notes |
|-------|--------|-------|
| No server redirects | ✅ | No `redirect()`; no middleware |
| Client navigation only | ✅ | `useRouter`, `Link` from `next/navigation`; all client-side |

Auth protection is done via `useAuthGuard` (client-side) because middleware does not run with `output: 'export'`.

## 7. Service Worker ⚠️ → ✅ (Fixed)

| Check | Status | Notes |
|-------|--------|-------|
| Capacitor compatibility | ✅ | **Fixed:** SW registration skipped when `Capacitor.isNativePlatform()` |

**Background:** iOS WKWebView does not support service workers; Android WebView has registration issues. Capacitor bundles all assets locally, so a SW is not needed for native builds.

**Change made:** `RegisterServiceWorker` now skips registration in Capacitor (web only).

## 8. Authentication ✅

| Check | Status | Notes |
|-------|--------|-------|
| Token storage in WebView | ✅ | `localStorageService` → `localStorage`; available in Android/iOS WebView |
| HTTP-only cookies | ✅ | Not used; tokens in memory/localStorage |
| Auth flow | ✅ | Bearer token in `Authorization` header; no server-side auth session |

---

# Breaking Issues (Must Fix)

## 1. ~~Service worker in Capacitor~~ ✅ Fixed

Service worker registration is now disabled in Capacitor to avoid iOS/Android WebView issues.

## 2. Environment configuration for production

**Issue:** If `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_PROJECT_PREFIX` are both unset, `apiBaseUrl` falls back to `https://api.example.com`, which will fail.

**Action:** Configure env vars in CI/native build (`.env.production` or build scripts):

- At least one of: `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_PROJECT_PREFIX`
- All BFE headers as needed

---

# Potential Mobile Runtime Risks

1. **CORS:** Backend must allow the Capacitor origin (`capacitor://localhost`, `https://localhost`, or your scheme) in CORS.
2. **Network:** Device must reach API; ensure no firewall/network rules block the host.
3. **SSL:** API should use HTTPS; WebView may block mixed content.
4. **`lib/locales/static.ts`:** Imports from `@/public/locales/`. Verify these JSON files exist and are copied into `out/` during export.

---

# Optimizations for Mobile

1. **SW disabled in Capacitor** – Avoids registration problems; assets are bundled.
2. **Images unoptimized** – Needed for static export; use `loading="lazy"` for below-the-fold images.
3. **Capacitor plugins** – Dynamic imports in `plugins/capacitor/index.ts` avoid errors when Capacitor is absent (e.g. web dev).
4. **Safe area** – `env(safe-area-inset-*)` in layout for notch/home indicator.

---

# Required Changes for Production Android Build

1. Set all `NEXT_PUBLIC_*` env vars in build (see section 4).
2. Run `npm run build` → `npx cap sync` → `cd android && ./gradlew assembleRelease`.
3. Ensure `capacitor.config.ts` `webDir: "out"` matches Next.js export output.
4. Verify API base URL is reachable from real devices (no localhost in production).
5. Add `android/app/src/main/AndroidManifest.xml` permissions (e.g. INTERNET) if not already present.
