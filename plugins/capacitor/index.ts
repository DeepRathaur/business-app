/**
 * Capacitor Plugin - Native bridge utilities
 * Centralizes Capacitor APIs for WebView detection and native features
 * Enables plug-and-play: disable this module to run web-only
 */

export async function isNative(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const { Capacitor } = await import("@capacitor/core");
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export async function hideSplashScreen(): Promise<void> {
  try {
    const { SplashScreen } = await import("@capacitor/splash-screen");
    await SplashScreen.hide();
  } catch {
    // Not in Capacitor
  }
}

export async function configureStatusBar(): Promise<void> {
  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setBackgroundColor({ color: "#E40000" });
    await StatusBar.setStyle({ style: Style.Dark });
  } catch {
    // Not in Capacitor or StatusBar unavailable
  }
}
