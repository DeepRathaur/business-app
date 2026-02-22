"use client";

import { type ReactNode } from "react";

/**
 * SafeAreaWrapper - Handles notch, home indicator, and dynamic island
 * Uses env(safe-area-inset-*) for proper padding on all iOS/Android devices
 * Critical for native app feel in Capacitor WebView
 */
interface SafeAreaWrapperProps {
  children: ReactNode;
  className?: string;
  /** Include top safe area (notch, status bar) */
  top?: boolean;
  /** Include bottom safe area (home indicator) */
  bottom?: boolean;
}

export default function SafeAreaWrapper({
  children,
  className = "",
  top = true,
  bottom = true,
}: SafeAreaWrapperProps) {
  return (
    <div
      className={`
        flex flex-col flex-1
        ${top ? "pt-[env(safe-area-inset-top,0px)]" : ""}
        ${bottom ? "pb-[env(safe-area-inset-bottom,0px)]" : ""}
        pl-[env(safe-area-inset-left,0px)]
        pr-[env(safe-area-inset-right,0px)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}
