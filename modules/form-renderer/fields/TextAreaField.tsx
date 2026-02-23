"use client";

import { memo, useCallback } from "react";
import type { FieldComponentProps } from "../types";
import { cn } from "@/lib/utils/cn";

const inputBaseClass =
  "mt-0 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 resize-y min-h-[80px]";

function TextAreaFieldComponent({
  name,
  config,
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: FieldComponentProps<string>) {
  const val = value === undefined || value === null ? "" : String(value);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value),
    [onChange]
  );
  const rows = (config as { rows?: number }).rows ?? 3;

  return (
    <textarea
      id={`fr-${name}`}
      value={val}
      onChange={handleChange}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={(config as { placeholder?: string }).placeholder}
      rows={rows}
      aria-invalid={!!error}
      className={cn(inputBaseClass, error && "border-red-500")}
    />
  );
}

export const TextAreaField = memo(TextAreaFieldComponent);
