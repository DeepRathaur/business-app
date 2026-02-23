/**
 * Form Renderer - Field type registry (plugin-based)
 * Register or override field components by type.
 */

import type React from "react";
import type { FieldType, FieldRegistry, FieldComponentProps } from "../types";
import { TextField } from "./TextField";
import { TextAreaField } from "./TextAreaField";
import { NumberField } from "./NumberField";
import { FileField } from "./FileField";
import { DropdownField } from "./DropdownField";
import { DateField } from "./DateField";
import { DateRangeField } from "./DateRangeField";
import { RadioField } from "./RadioField";
import { CheckboxField } from "./CheckboxField";
import { ButtonField } from "./ButtonField";
import { CurrencyField } from "./CurrencyField";
import { HiddenField } from "./HiddenField";
import { DisabledField } from "./DisabledField";

type AnyFieldComponent = (props: FieldComponentProps<unknown>) => React.ReactNode;

const defaultRegistry: FieldRegistry = new Map([
  ["text", TextField as AnyFieldComponent],
  ["textArea", TextAreaField as AnyFieldComponent],
  ["number", NumberField as AnyFieldComponent],
  ["file", FileField as AnyFieldComponent],
  ["dropdown", DropdownField as AnyFieldComponent],
  ["date", DateField as AnyFieldComponent],
  ["dateRange", DateRangeField as AnyFieldComponent],
  ["radio", RadioField as AnyFieldComponent],
  ["checkbox", CheckboxField as AnyFieldComponent],
  ["button", ButtonField as AnyFieldComponent],
  ["currency", CurrencyField as AnyFieldComponent],
  ["hidden", HiddenField as AnyFieldComponent],
  ["disabled", DisabledField as AnyFieldComponent],
]);

let registry: FieldRegistry = new Map(defaultRegistry);

export function getFieldRegistry(): FieldRegistry {
  return registry;
}

export function registerField(type: FieldType, component: (props: FieldComponentProps) => React.ReactNode): void {
  registry.set(type, component as AnyFieldComponent);
}

export function resetFieldRegistry(): void {
  registry = new Map(defaultRegistry);
}
