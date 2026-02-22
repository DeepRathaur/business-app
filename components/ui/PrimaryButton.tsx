"use client";

import { type ButtonHTMLAttributes } from "react";

/**
 * PrimaryButton - Primary CTA button
 * Min 44px height for touch targets (WCAG)
 * Variants for different contexts
 */
interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
}

export default function PrimaryButton({
  children,
  variant = "primary",
  size = "md",
  fullWidth = true,
  loading = false,
  disabled,
  className = "",
  ...props
}: PrimaryButtonProps) {
  const baseClasses =
    "mt-5 w-full rounded-md bg-[#141a2a] text-white py-3 text-sm font-medium hover:opacity-95 inline-flex items-center justify-center font-semibold rounded-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

  const variants = {
    primary:
      " text-primary hover:bg-red-500/95 shadow-card",
    secondary:
      "bg-white/20 text-white border border-white/30 hover:bg-red-500/30",
    outline:
      "bg-transparent text-white border-2 border-white hover:bg-red-500/10",
    ghost: "bg-transparent text-white hover:bg-red-500/10",
  };

  const sizes = {
    sm: "h-10 px-4 text-sm",
    md: "text-base min-h-[44px]",
    lg: "h-14 px-8 text-lg min-h-[48px]",
  };

  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
