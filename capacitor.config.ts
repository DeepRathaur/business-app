import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor Configuration - Airtel Business App
 *
 * Build Process:
 * 1. Web: npm run build  -> outputs static files to ./out
 * 2. Sync: npx cap sync -> copies web assets to android/ios
 * 3. Run:  npx cap run android | npx cap run ios
 *
 * Android: cd android && ./gradlew assembleDebug
 * iOS:     Open ios/App/App.xcworkspace in Xcode, build
 */
const config: CapacitorConfig = {
  appId: "com.airtelbusinesscare.app",
  appName: "airtel-business-app",
  webDir: "out", // Must match Next.js output: 'export' in next.config.ts
  server: {
    androidScheme: "https",
    // basePath: "/app" - uncomment if using basePath in Next.js
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0, // Let Next.js splash handle transition
      backgroundColor: "#E40000",
    },
  },
};

export default config;
