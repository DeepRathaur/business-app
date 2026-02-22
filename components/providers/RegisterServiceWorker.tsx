"use client";

import { useEffect } from "react";

/**
 * Registers service worker for web only.
 * Capacitor iOS WKWebView does not support service workers; Android has registration issues.
 * Capacitor bundles assets locally, so SW is unnecessary in native.
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const { Capacitor } = await import("@capacitor/core");
        if (Capacitor.isNativePlatform()) return; // Skip SW in Capacitor (Android/iOS)
      } catch {
        /* Capacitor not loaded - assume web */
      }

      window.navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          if (reg.installing) reg.installing.addEventListener("statechange", () => {});
        })
        .catch(() => {});
    };

    register();
  }, []);
  return null;
}
