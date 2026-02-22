"use client";

import { type ReactNode } from "react";

/**
 * MobileContainer - Wraps content for mobile-first layouts
 * Uses 100dvh for proper viewport on all devices
 * Max width constrains on larger screens for consistency
 */
interface MobileContainerProps {
  children: ReactNode;
  className?: string;
  /** Enable scroll for content that may overflow */
  scroll?: boolean;
}

export default function MobileContainer({
  children,
  className = "",
  scroll = false,
}: MobileContainerProps) {
  return (
    <div
      className={`
        w-full max-w-[430px] mx-auto
        min-h-[100dvh]
        flex flex-col
        ${scroll ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
