"use client";

import { memo, useCallback } from "react";
import type { FieldComponentProps } from "../types";
import { cn } from "@/lib/utils/cn";

function CheckboxFieldComponent({
  name,
  config,
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: FieldComponentProps<boolean>) {
  const checked = Boolean(value);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked),
    [onChange]
  );
  const label = (config as { checkboxLabel?: string }).checkboxLabel ?? (config as { label?: string }).label;

  return (
    <label className={cn("flex items-center gap-2 cursor-pointer", disabled && "opacity-60 cursor-not-allowed")}>
      <input
        id={`fr-${name}`}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={!!error}
        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-gray-500"
      />
      {label && <span className="text-sm text-gray-800">{label}</span>}
    </label>
  );
}

export const CheckboxField = memo(CheckboxFieldComponent);
