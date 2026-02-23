"use client";

import { memo, useCallback } from "react";
import type { FieldComponentProps } from "../types";
import type { DateRangeFieldConfig } from "../types";
import { cn } from "@/lib/utils/cn";

const inputBaseClass =
  "mt-0 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-gray-800 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 min-h-[44px]";

/** Value for date range is { start: string, end: string } */
function DateRangeFieldComponent({
  name,
  config,
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: FieldComponentProps<{ start: string; end: string }>) {
  const cfg = config as DateRangeFieldConfig;
  const v = value && typeof value === "object" && "start" in value
    ? (value as { start: string; end: string })
    : { start: "", end: "" };

  const handleStart = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...v, start: e.target.value } as unknown as { start: string; end: string });
      onBlur?.();
    },
    [v, onChange, onBlur]
  );

  const handleEnd = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ ...v, end: e.target.value } as unknown as { start: string; end: string });
      onBlur?.();
    },
    [v, onChange, onBlur]
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label htmlFor={`fr-${name}-start`} className="block text-xs text-gray-500 mb-0.5">From</label>
        <input
          id={`fr-${name}-start`}
          type="date"
          value={v.start}
          onChange={handleStart}
          onBlur={onBlur}
          disabled={disabled}
          min={cfg.minDate}
          max={cfg.maxDate}
          className={cn(inputBaseClass, error && "border-red-500")}
        />
      </div>
      <div>
        <label htmlFor={`fr-${name}-end`} className="block text-xs text-gray-500 mb-0.5">To</label>
        <input
          id={`fr-${name}-end`}
          type="date"
          value={v.end}
          onChange={handleEnd}
          onBlur={onBlur}
          disabled={disabled}
          min={v.start || cfg.minDate}
          max={cfg.maxDate}
          className={cn(inputBaseClass, error && "border-red-500")}
        />
      </div>
    </div>
  );
}

export const DateRangeField = memo(DateRangeFieldComponent);
