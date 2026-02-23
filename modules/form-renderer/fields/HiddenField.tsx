"use client";

import { memo } from "react";
import type { FieldComponentProps } from "../types";

function HiddenFieldComponent({ name, value }: FieldComponentProps<unknown>) {
  return (
    <input
      id={`fr-${name}`}
      type="hidden"
      name={name}
      value={typeof value === "string" ? value : JSON.stringify(value ?? "")}
      readOnly
    />
  );
}

export const HiddenField = memo(HiddenFieldComponent);
