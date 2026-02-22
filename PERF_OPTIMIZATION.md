# Performance optimization guide

## 1. SSR vs "use client" and static export

This app uses **`output: 'export'`** (static export for Capacitor). There is no per-request server; the server runs only at **build time**. So:

- **Server Components** run at build time and produce static HTML. They still reduce client JS.
- **Client Components** (`"use client"`) are the only ones that hydrate and run in the browser.

### What was done

- **Root layout** is now a **Server Component**: it only renders `<html>`, `<body>`, font, and a single client boundary `<ClientProviders>`. Font and layout structure are not in the client bundle.
- **`ClientProviders`** is the single client boundary at the root: all context providers (Config, Locale, Auth, Account, Service, Toast, AppBootstrap) and SW registration live here. Only this subtree is hydrated.
- **Auth layout** `app/(auth)/layout.tsx` is already a Server Component (no `"use client"`).
- **Main layout** `app/(main)/layout.tsx` stays client (needs `usePathname`, `AuthGuard`, `BottomNav`).

### Pages that should stay client

- **`app/page.tsx`** (splash): uses `useRouter`, `useState`, Capacitor splash, framer-motion → must stay client.
- **`app/(auth)/login/page.tsx`**: form state, OTP, locale, dynamic AnimatedLogo/QuickActions → client; layout kept minimal and heavy parts lazy-loaded.
- **`app/(auth)/register|forgot-password|reset-password|fetch-permission/page.tsx`**: forms and navigation → client.
- **`app/(main)/dashboard|manage-users|services|paybill|support|line-details/page.tsx`**: data fetching, account context, navigation → client.

### Optional: build-time config/locale

With static export, you can optionally move **config** and **locale** to build time:

- In a **Server Component** (e.g. root layout or a wrapper used only at build), call your config/locale API (or read from env/JSON).
- Pass the result as **initialData** into `ConfigProvider` / `LocaleProvider` so the client skips the first fetch and shows content immediately. Implement when your build environment can reach the config API.

---

## 2. Config and locale

- **Config** is still loaded on the client in `ConfigContext` via `ConfigurationService.fetchConfiguration`. `AppBootstrap` waits for it and shows a skeleton until ready.
- **Locale** is loaded in `LocaleContext` (static JSON first, then API). It depends on Config.
- To improve TTFB/First Paint you can later add **build-time** config/locale and pass them as initial data into the providers (see above).

---

## 3. Service worker

- **File**: `public/sw.js` (copied to `out/` on export).
- **Registration**: `RegisterServiceWorker` in `ClientProviders` registers `/sw.js` on the client.

**Strategies:**

- **Cache-first** (static assets):  
  - `/_next/static/*` (JS/CSS chunks)  
  - `/images/*` and common static extensions (e.g. `.png`, `.jpg`, `.svg`, `.ico`, `.webp`, `.woff2`, `.woff`, `.ttf`, `.eot`)
- **Network-only (no cache)** for API and auth:  
  - Any request with `Authorization` header  
  - URLs containing `/bfe/`, `bfe/web`, or `/api/`  
  - Authenticated API responses are never cached.

---

## 4. Bundle size and client JS

### Components to keep as Server Components (no `"use client"`)

- **Root layout** (`app/layout.tsx`) – done.
- **Auth layout** (`app/(auth)/layout.tsx`) – already server.

### Dynamic imports (already applied)

- **Login page**: `AnimatedLogo` and `QuickActions` are loaded with `next/dynamic` and `ssr: false` so they don’t block first paint; language sheet is CSS-only (`LanguageSheet.tsx`) so the login route doesn’t pull framer-motion for the dropdown.

### Suggested dynamic imports (optional)

- **Splash** (`app/page.tsx`): consider `dynamic(…)` for `AnimatedLogo` and `framer-motion` so the splash shell is smaller.
- **Dashboard**: heavy blocks (e.g. `BannerSlider`, `TrackDetails`, `ManageService`, `ServicePage`) can be dynamically imported with skeleton placeholders to split chunks.
- **Support / Paybill / Manage-users**: if they use framer-motion or large components, wrap those in `dynamic(…)` with a loading fallback.

### Remove unnecessary `"use client"`

- Only add `"use client"` where you use hooks, browser APIs, or context. Static presentational components (e.g. simple cards, headings) can stay server if they don’t need interactivity and are not under a client parent.

---

## 5. Loading and UX

- **AppBootstrap**: shows a single skeleton until config is ready.
- **AuthGuard**: shows loading until auth check completes, then redirects or renders children.
- Consider adding **`error.tsx`** at `app/error.tsx` and `app/(main)/error.tsx` for error boundaries.
- For data-heavy pages, use **Suspense** boundaries with skeletons where you introduce async client data (e.g. dashboard sections).

---

## 6. Image optimization

- **Current**: `images: { unoptimized: true }` (required for static export / Capacitor). Keep as is.
- Use **sized** images and `width`/`height` (or `fill`) to avoid layout shift; prefer **WebP** where possible and `loading="lazy"` for below-the-fold images.

---

## 7. Caching strategy (summary)

- **Static assets**: service worker cache-first (see above).
- **API**: never cached by the service worker; always network.
- **Config/locale**: currently client fetch; optional improvement is build-time data + initialData to avoid first-load fetch.

---

## 8. Avoiding unnecessary hydration

- Root layout is server; only **ClientProviders** and its subtree hydrate.
- Login page: **AnimatedLogo** and **QuickActions** are dynamically imported so their JS loads after initial paint; **LanguageSheet** is CSS-only.
- Keep **client boundaries as low as possible**: push `"use client"` down to the component that actually needs hooks/events (e.g. a single button or form), and let the rest be server or non-interactive.

---

## 9. Production build checklist

- [x] Root layout is a Server Component; single client boundary (`ClientProviders`).
- [x] Service worker: cache-first for static/JS; network-only for API; no cache for authenticated requests.
- [x] Login: dynamic AnimatedLogo and QuickActions; CSS-only language sheet.
- [x] `next.config`: `compress: true`, `poweredByHeader: false`, `reactStrictMode: true`.
- [ ] Optional: build-time config/locale and initialData for providers.
- [ ] Optional: more `dynamic()` on dashboard and other heavy pages with skeletons.
- [ ] Optional: add `app/error.tsx` and `app/(main)/error.tsx`.
