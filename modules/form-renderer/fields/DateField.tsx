"use client";

import { memo, useCallback } from "react";
import type { FieldComponentProps } from "../types";
import type { DateFieldConfig } from "../types";
import { cn } from "@/lib/utils/cn";

const inputBaseClass =
  "mt-0 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-gray-800 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 min-h-[44px]";

function DateFieldComponent({
  name,
  config,
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: FieldComponentProps<string>) {
  const cfg = config as DateFieldConfig;
  const val = value === undefined || value === null ? "" : String(value);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value as unknown as string);
      onBlur?.();
    },
    [onChange, onBlur]
  );

  return (
    <input
      id={`fr-${name}`}
      type="date"
      value={val}
      onChange={handleChange}
      onBlur={onBlur}
      disabled={disabled}
      min={cfg.minDate}
      max={cfg.maxDate}
      aria-invalid={!!error}
      className={cn(inputBaseClass, error && "border-red-500")}
    />
  );
}

export const DateField = memo(DateFieldComponent);
