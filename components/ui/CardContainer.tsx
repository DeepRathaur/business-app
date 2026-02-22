"use client";

import { type ReactNode } from "react";

/**
 * CardContainer - Elevation container for grouped content
 * Uses design token radius and shadow
 */
interface CardContainerProps {
  children: ReactNode;
  className?: string;
  /** Reduced padding for compact layouts */
  compact?: boolean;
}

export default function CardContainer({
  children,
  className = "",
  compact = false,
}: CardContainerProps) {
  return (
    <div
      className={`
        bg-white/10 backdrop-blur-sm
        rounded-2xl
        shadow-card
        border border-white/10
        ${compact ? "p-4" : "p-5"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
