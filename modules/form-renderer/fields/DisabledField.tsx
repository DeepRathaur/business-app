"use client";

import { memo } from "react";
import type { FieldComponentProps } from "../types";
import { cn } from "@/lib/utils/cn";

const inputBaseClass =
  "mt-0 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed";

function DisabledFieldComponent({
  name,
  config,
  value,
  error,
}: FieldComponentProps<unknown>) {
  const display = value === undefined || value === null ? "" : String(value);
  return (
    <input
      id={`fr-${name}`}
      type="text"
      value={display}
      readOnly
      disabled
      aria-invalid={!!error}
      className={cn(inputBaseClass, error && "border-red-500")}
    />
  );
}

export const DisabledField = memo(DisabledFieldComponent);
