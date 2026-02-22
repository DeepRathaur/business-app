"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";

/**
 * FormInput - Accessible, mobile-optimized input
 * Supports light theme (login card) and dark theme
 */
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  /** Light theme for white cards (black labels) */
  theme?: "light" | "dark";
  /** Show password toggle eye icon */
  showPasswordToggle?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      hint,
      theme = "dark",
      showPasswordToggle = false,
      className = "",
      id,
      type,
      ...props
    },
    ref
  ) => {
    const [showPass, setShowPass] = useState(false);
    const inputId = id ?? label?.toLowerCase().replace(/\s/g, "-");
    const isLight = theme === "light";
    const isPassword = type === "password";
    const inputType =
      isPassword && showPasswordToggle ? (showPass ? "text" : "password") : type;

    const labelClass = isLight
      ? "text-neutral-800 font-medium"
      : "text-white/90 font-medium";

    const inputClass = `
      w-full min-h-[44px] px-1 py-3
      text-base text-neutral-900 bg-transparent
      border-0 border-b border-neutral-300
      placeholder:text-neutral-400
      focus:outline-none focus:ring-0 focus:border-primary focus:border-b-2
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-colors
      ${error ? "!border-red-500" : ""}
      ${showPasswordToggle && isPassword ? "pr-12" : ""}
      ${className}
    `;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-sm mb-2 ${labelClass}`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={inputClass}
            autoComplete={
              type === "email"
                ? "email"
                : type === "password"
                  ? "current-password"
                  : "off"
            }
            {...props}
          />
          {showPasswordToggle && isPassword && (
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 p-1"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}
        {hint && !error && (
          <p className={`mt-1.5 text-xs ${isLight ? "text-neutral-600" : "text-white/70"}`}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
