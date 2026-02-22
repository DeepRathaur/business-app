# Airtel Business App - Architecture

Production-grade mobile-first SaaS built with Next.js 16, Capacitor, and Tailwind CSS.

## Design System (Figma-First)

- **Spacing**: 4px/8px grid (`tokens.spacing`)
- **Typography**: Mobile-first scale (10px–30px) in `lib/design-tokens`
- **Colors**: Airtel primary `#E40000`, neutral palette
- **Radius**: 4px–24px scale for inputs, cards, modals
- **Shadows**: Elevation hierarchy (sm → xl)

## Mobile Support

- **Viewport**: `100dvh` (dynamic viewport) for address bar/keyboard
- **Safe Areas**: `env(safe-area-inset-*)` for notch/home indicator
- **Breakpoints**: 320px–430px primary, `max-w-[430px]` container
- **Touch Targets**: Min 44px height on buttons/inputs

## Folder Structure

```
core/               # Enterprise core layer
  api/              # httpClient + requestInterceptor (BFE headers) + responseInterceptor (401 logout)
  config/           # Global config singleton (API base, feature flags)
  constants/        # LocalStorage keys, errors, API URLs
  models/           # DTOs (auth.models, etc.)
  services/         # auth.service, account.service, localStorage.service, language.service

shared/
  utils/            # Validation (returns i18n keys), maskEmail

core/utils/         # getOS() for x-device-type (android/ios/web), Capacitor-safe

context/            # AuthContext, LocaleContext, ToastContext

features/
  auth/
    login/          # LoginForm, OTPVerification, CustomOtpBoxes, useLoginFlow

app/
  (auth)/           # Auth flow - layout wraps login/register/etc
    login/
    register/
    forgot-password/
    reset-password/
  (main)/           # Post-login - layout with optional bottom nav
    dashboard/
    manage-users/
    paybill/
    support/
  layout.tsx        # Root layout (StatusBar, safe-area)

components/
  ui/               # Atomic primitives
  forms/
  layout/
  animations/

modules/            # Feature modules - logic/services
  auth/
  dashboard/
  users/

plugins/            # Plug-and-play extensions
  capacitor/        # Native bridge
  analytics/
  payments/

lib/
  design-tokens/
  config/
  utils/
```

## Architecture Decisions

1. **Route Groups `(auth)` and `(main)`**: Separate layouts for unauthenticated vs authenticated flows without URL pollution.

2. **Client vs Server Components**: `"use client"` only where needed (forms, animations, Capacitor). Layouts and static content remain server-compatible.

3. **Conditional Bottom Nav**: Shown only on Dashboard and Manage Users. Support/Pay Bill accessible from both auth and main flows—use `router.back()` for contextual back.

4. **Plugin System**: Capacitor, Analytics, Payments are isolated. Disable/swap without touching app code.

5. **Module Services**: Auth, Dashboard, Users have dedicated `services/` for API calls. Swap implementations for real backends.

6. **Auth Architecture (Login)**: Clean layered structure. No API calls in components. Flow: `core/api` → `auth.service` → `useLoginFlow`. Token via `accountService` (LocalStorage). AuthInterceptor attaches token. Master URLs from `core/constants/api-urls.ts`. UMS2 supported when `NEXT_PUBLIC_ENABLE_UMS2=true`.

7. **i18n**: `LocaleContext` provides `t(key)`, `changeLanguage(lang)`, `currentLanguage`. Loads from localStorage or config. Fetches from API with fallback to `/locales/{lang}.json`. Caches API translations. All UI strings use `t()`.

8. **Services**: `localStorageService` (typed), `accountService` (token/user), `language.service` (API locale fetch). Global config via `getGlobalConfig()` singleton.

9. **Interceptors** (from temp/interceptors.txt): `requestInterceptor` adds BFE headers (opco, product, x-api-key, x-service-id, etc.), requestDate, requestId, x-device-type (via `getOS()`), Authorization. `responseInterceptor` handles 401/403 → `accountService.logout()` (except reset-password/forgot-password), 503/500 logging. Fetch-based (no axios) for Capacitor/Android WebView compatibility.

## Capacitor Build

1. `npm run build` → outputs to `out/`
2. `npx cap sync` → copies to android/ios
3. `npx cap run android` | `npx cap run ios`

## Performance

- Static export (`output: 'export'`) for Capacitor
- Server Components where possible (no `"use client"`)
- Lazy-load heavy modules (plugins use dynamic import)
- Framer Motion animations use `will-change` implicitly
