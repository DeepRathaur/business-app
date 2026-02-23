"use client";

import { memo, useCallback } from "react";
import type { FieldComponentProps } from "../types";
import { cn } from "@/lib/utils/cn";

const inputBaseClass =
  "mt-0 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500";

function NumberFieldComponent({
  name,
  config,
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: FieldComponentProps<number | string>) {
  const raw = value === undefined || value === null ? "" : value;
  const val = typeof raw === "number" ? raw : raw === "" ? "" : Number(raw);
  const displayVal = val === "" ? "" : String(val);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (v === "") {
        onChange("" as unknown as number);
        return;
      }
      const num = Number(v);
      if (!Number.isNaN(num)) onChange(num as unknown as number);
    },
    [onChange]
  );

  const cfg = config as { step?: number; minValue?: number; maxValue?: number };
  return (
    <input
      id={`fr-${name}`}
      type="number"
      value={displayVal}
      onChange={handleChange}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={(config as { placeholder?: string }).placeholder}
      min={cfg.minValue}
      max={cfg.maxValue}
      step={cfg.step ?? 1}
      aria-invalid={!!error}
      className={cn(inputBaseClass, error && "border-red-500")}
    />
  );
}

export const NumberField = memo(NumberFieldComponent);
