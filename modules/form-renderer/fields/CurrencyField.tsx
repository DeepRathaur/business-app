"use client";

import { memo, useCallback } from "react";
import type { FieldComponentProps } from "../types";
import { cn } from "@/lib/utils/cn";

const inputBaseClass =
  "mt-0 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500";

function CurrencyFieldComponent({
  name,
  config,
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: FieldComponentProps<number | string>) {
  const cfg = config as { currency?: string; minValue?: number; maxValue?: number };
  const currency = cfg.currency ?? "KES";
  const raw = value === undefined || value === null ? "" : value;
  const numVal = typeof raw === "number" ? raw : raw === "" ? "" : Number(String(raw).replace(/[^0-9.-]/g, ""));
  const displayVal = numVal === "" ? "" : String(numVal);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value.replace(/[^0-9.]/g, "");
      if (v === "") {
        onChange("" as unknown as number);
        return;
      }
      const num = parseFloat(v);
      if (!Number.isNaN(num)) onChange(num as unknown as number);
    },
    [onChange]
  );

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
        {currency}
      </span>
      <input
        id={`fr-${name}`}
        type="text"
        inputMode="decimal"
        value={displayVal}
        onChange={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={(config as { placeholder?: string }).placeholder ?? "0.00"}
        min={cfg.minValue}
        max={cfg.maxValue}
        aria-invalid={!!error}
        className={cn(inputBaseClass, "pl-12", error && "border-red-500")}
      />
    </div>
  );
}

export const CurrencyField = memo(CurrencyFieldComponent);
