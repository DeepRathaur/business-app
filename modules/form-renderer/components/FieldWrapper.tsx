"use client";

import { memo, type ReactNode } from "react";
import type { BaseFieldConfig, FieldConfig } from "../types";
import { cn } from "@/lib/utils/cn";

interface FieldWrapperProps {
  config: FieldConfig;
  error?: string;
  children: ReactNode;
  visible?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Wraps each field: label, error below, optional toggle classes.
 * Hidden when visible=false (dynamic show/hide).
 */
function FieldWrapperComponent({
  config,
  error,
  children,
  visible = true,
  disabled,
  className,
}: FieldWrapperProps) {
  const base = config as BaseFieldConfig;
  if (!visible) return null;

  const wrapperClass = cn(
    "w-full",
    base.className,
    error && base.toggleClass?.find((t) => t.when === "error")?.className,
    className
  );

  const labelId = `fr-${config.name}-label`;
  const isRequired = base.required;
  const isHidden = config.type === "hidden";

  if (isHidden) {
    return <div className="hidden">{children}</div>;
  }

  return (
    <div className={wrapperClass} data-field={config.name}>
      {base.label && (
        <label
          id={labelId}
          htmlFor={`fr-${config.name}`}
          className="block text-sm font-semibold text-gray-800 mb-1.5"
        >
          {base.label}
          {isRequired && <span className="ml-0.5 text-red-500" aria-hidden>*</span>}
        </label>
      )}
      <div className={base.label ? "mt-0" : ""}>{children}</div>
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export const FieldWrapper = memo(FieldWrapperComponent);
