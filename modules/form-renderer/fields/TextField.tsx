"use client";

import { memo, useCallback } from "react";
import type { FieldComponentProps } from "../types";
import { cn } from "@/lib/utils/cn";

const inputBaseClass =
  "mt-0 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500";

function TextFieldComponent({
  name,
  config,
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: FieldComponentProps<string | number>) {
  const val = value === undefined || value === null ? "" : String(value);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      const sub = (config as { subtype?: string }).subtype;
      if (sub === "mobile") {
        const digits = v.replace(/\D/g, "").slice(0, (config as { maxLength?: number }).maxLength ?? 15);
        onChange(digits as unknown as string);
      } else {
        onChange(v as unknown as string);
      }
    },
    [config, onChange]
  );

  const type = (config as { subtype?: string }).subtype === "mobile" ? "tel" : "text";
  const maxLength = (config as { maxLength?: number }).maxLength;
  const minLength = (config as { minLength?: number }).minLength;

  return (
    <input
      id={`fr-${name}`}
      type={type}
      value={val}
      onChange={handleChange}
      onBlur={onBlur}
      disabled={disabled}
      placeholder={(config as { placeholder?: string }).placeholder}
      maxLength={maxLength}
      minLength={minLength}
      inputMode={type === "tel" ? "numeric" : "text"}
      autoComplete="off"
      aria-invalid={!!error}
      aria-describedby={error ? `fr-${name}-error` : undefined}
      className={cn(inputBaseClass, error && "border-red-500")}
    />
  );
}

export const TextField = memo(TextFieldComponent);
