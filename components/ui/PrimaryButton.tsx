"use client";

import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  /** @deprecated no longer used; kept for backward compatibility */
  variant?: "primary" | "secondary" | "outline" | "ghost";
  /** @deprecated no longer used; kept for backward compatibility */
  size?: "sm" | "md" | "lg";
  /** @deprecated no longer used; kept for backward compatibility */
  fullWidth?: boolean;
}

export default function PrimaryButton({
  children,
  loading = false,
  disabled,
  className,
  variant,
  size,
  fullWidth,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled ?? loading}
      className={cn(
        "w-[100%] text-sm flex justify-center button mt-6 mb-6",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
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
