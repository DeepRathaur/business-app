"use client";

import { memo, useCallback } from "react";
import type { FieldComponentProps } from "../types";
import { cn } from "@/lib/utils/cn";

function RadioFieldComponent({
  name,
  config,
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: FieldComponentProps<string>) {
  const options = (config as { options: { value: string; label: string }[] }).options ?? [];
  const current = value === undefined || value === null ? "" : String(value);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  );

  return (
    <div className="flex flex-col gap-2" role="radiogroup" aria-labelledby={`fr-${name}-label`} aria-invalid={!!error}>
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn("flex items-center gap-2 cursor-pointer", disabled && "opacity-60 cursor-not-allowed")}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={current === opt.value}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            className="h-4 w-4 border-gray-300 text-primary focus:ring-gray-500"
          />
          <span className="text-sm text-gray-800">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

export const RadioField = memo(RadioFieldComponent);
