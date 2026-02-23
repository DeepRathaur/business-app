"use client";

import { memo, useCallback } from "react";
import type { FieldComponentProps } from "../types";
import { cn } from "@/lib/utils/cn";

function ButtonFieldComponent({
  name,
  config,
  disabled,
}: FieldComponentProps<unknown>) {
  const cfg = config as { buttonLabel: string; buttonType?: "button" | "submit"; action?: string };
  const label = cfg.buttonLabel ?? "Submit";
  const type = cfg.buttonType ?? "button";

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (type === "button") e.preventDefault();
      // Action/event is typically handled by parent FormRenderer via onSubmit or onAction
    },
    [type]
  );

  return (
    <button
      id={`fr-${name}`}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        "w-full rounded-md bg-[#141a2a] text-white py-3 text-sm font-medium",
        "hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed",
        "min-h-[44px]"
      )}
    >
      {label}
    </button>
  );
}

export const ButtonField = memo(ButtonFieldComponent);
