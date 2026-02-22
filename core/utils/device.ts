/**
 * Device / OS detection - Works in browser and Capacitor (Android/iOS WebView)
 * Used for x-device-type header. SSR-safe.
 */

export type DeviceType = "android" | "ios" | "web";

let cachedDevice: DeviceType | "" = "";

/**
 * Returns device type for API headers. Caches result.
 * Capacitor: uses Capacitor.getPlatform()
 * Browser: uses userAgent fallback
 */
export function getOS(): DeviceType {
  if (cachedDevice) return cachedDevice;

  if (typeof window === "undefined") {
    return "web";
  }

  try {
    const ua = window.navigator.userAgent.toLowerCase();
    if (/android/i.test(ua)) {
      cachedDevice = "android";
      return "android";
    }
    if (/iphone|ipad|ipod/i.test(ua)) {
      cachedDevice = "ios";
      return "ios";
    }
  } catch {
    // ignore
  }

  cachedDevice = "web";
  return "web";
}

/**
 * Async version for Capacitor - use when Capacitor may not be loaded yet
 */
export async function getOSAsync(): Promise<DeviceType> {
  if (cachedDevice) return cachedDevice;

  if (typeof window === "undefined") return "web";

  try {
    const { Capacitor } = await import("@capacitor/core");
    const platform = Capacitor.getPlatform();
    if (platform === "android") {
      cachedDevice = "android";
      return "android";
    }
    if (platform === "ios") {
      cachedDevice = "ios";
      return "ios";
    }
  } catch {
    return getOS();
  }

  return getOS();
}
