# Airtel Business App

Production-grade mobile-first SaaS built with Next.js 16, Capacitor, Tailwind CSS, and Framer Motion.

## Tech Stack

- **Next.js 16** (App Router, static export)
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion**
- **Capacitor** (Android & iOS)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view in the browser.

## Build for Production

```bash
npm run build
```

Outputs static files to `out/` for Capacitor.

## Capacitor (Native Apps)

1. **Build web assets**: `npm run build`
2. **Sync to native**: `npx cap sync`
3. **Run on device**:
   - Android: `npx cap run android`
   - iOS: `npx cap run ios`

Or open in IDE:
- Android: `npx cap open android`
- iOS: `npx cap open ios`

See [ARCHITECTURE.md](./ARCHITECTURE.md) for design system, folder structure, and architecture decisions.
