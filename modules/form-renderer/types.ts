/**
 * Form Renderer - Type definitions
 * Configuration-driven dynamic form layout and validation.
 */

import type { ReactNode } from "react";

/** Supported field type identifiers (plugin-based) */
export type FieldType =
  | "text"
  | "textArea"
  | "number"
  | "file"
  | "dropdown"
  | "date"
  | "dateRange"
  | "radio"
  | "checkbox"
  | "button"
  | "currency"
  | "hidden"
  | "disabled";

/** Base field config present in all fields */
export interface BaseFieldConfig {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  defaultValue?: unknown;
  /** CSS class applied to wrapper */
  className?: string;
  /** Toggle class when condition is met (e.g. "border-red-500" when error) */
  toggleClass?: { when: string; className: string }[];
  /** Show field only when expression/other field value matches */
  showWhen?: VisibilityCondition;
  /** Disable field when condition matches */
  disableWhen?: VisibilityCondition;
  /** Mandatory validation */
  required?: boolean;
  /** Custom error message for required */
  requiredMessage?: string;
}

/** Condition for dynamic show/hide or disable (field name + expected value) */
export interface VisibilityCondition {
  field: string;
  value?: unknown;
  /** Or use operator for comparison */
  operator?: "eq" | "neq" | "empty" | "notEmpty";
}

/** Pattern (regex) validation */
export interface PatternValidation {
  pattern: string;
  message: string;
}

/** Length validation */
export interface LengthValidation {
  minLength?: number;
  maxLength?: number;
  message?: string;
}

/** Numeric range validation */
export interface RangeValidation {
  minValue?: number;
  maxValue?: number;
  message?: string;
}

/** API trigger for validation (e.g. mobile number check) */
export interface ApiValidationTrigger {
  /** Trigger on: "blur" | "click" (action button) */
  trigger: "blur" | "click";
  /** API endpoint or handler key */
  endpoint?: string;
  /** Optional request payload mapping */
  payloadMap?: Record<string, string>;
}

/** Async validation rule */
export interface AsyncValidation {
  /** Unique key for this async validator */
  key: string;
  /** API endpoint or handler */
  endpoint?: string;
  /** Debounce ms before calling */
  debounce?: number;
  message?: string;
}

/** File field specific config */
export interface FileFieldConfig extends BaseFieldConfig {
  type: "file";
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // bytes
  maxFiles?: number;
  /** Mime types allowed e.g. ["image/*", "application/pdf"] */
  allowedTypes?: string[];
  dragDrop?: boolean;
  showPreview?: boolean;
  allowRemove?: boolean;
}

/** Dropdown specific config */
export interface DropdownFieldConfig extends BaseFieldConfig {
  type: "dropdown";
  options: { value: string; label: string }[] | string;
  /** "single" | "multi" | "searchable" */
  mode?: "single" | "multi" | "searchable";
  /** Dynamic options from API key */
  optionsKey?: string;
}

/** Date field config */
export interface DateFieldConfig extends BaseFieldConfig {
  type: "date";
  format?: string;
  minDate?: string;
  maxDate?: string;
  calendarPopup?: boolean;
}

/** Date range config */
export interface DateRangeFieldConfig extends BaseFieldConfig {
  type: "dateRange";
  startName: string;
  endName: string;
  format?: string;
  minDate?: string;
  maxDate?: string;
}

/** Mobile number special config (numbers only + API validation) */
export interface MobileFieldConfig extends BaseFieldConfig {
  type: "text";
  subtype?: "mobile";
  minLength?: number;
  maxLength?: number;
  apiValidation?: ApiValidationTrigger;
}

/** Union of all field configs */
export type FieldConfig =
  | (BaseFieldConfig & { type: "text"; subtype?: string; pattern?: PatternValidation; minLength?: number; maxLength?: number; apiValidation?: ApiValidationTrigger })
  | (BaseFieldConfig & { type: "textArea"; rows?: number; pattern?: PatternValidation; minLength?: number; maxLength?: number })
  | (BaseFieldConfig & { type: "number"; minValue?: number; maxValue?: number; step?: number })
  | FileFieldConfig
  | DropdownFieldConfig
  | DateFieldConfig
  | DateRangeFieldConfig
  | (BaseFieldConfig & { type: "radio"; options: { value: string; label: string }[] })
  | (BaseFieldConfig & { type: "checkbox"; checkboxLabel?: string })
  | (BaseFieldConfig & { type: "button"; buttonLabel: string; buttonType?: "button" | "submit"; action?: string })
  | (BaseFieldConfig & { type: "currency"; currency?: string; minValue?: number; maxValue?: number })
  | (BaseFieldConfig & { type: "hidden" })
  | (BaseFieldConfig & { type: "disabled" });

/** Layout: sections and columns */
export interface LayoutSection {
  id?: string;
  title?: string;
  columns?: number;
  fields: FieldConfig[];
}

export interface FormLayoutConfig {
  formId: string;
  sections: LayoutSection[];
  /** Submit button config if not inline */
  submitLabel?: string;
}

/** Props passed to every registered field component */
export interface FieldComponentProps<T = unknown> {
  name: string;
  config: FieldConfig;
  value: T;
  onChange: (value: T) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  visible?: boolean;
  /** For async/API validation loading state */
  validating?: boolean;
}

/** Field component type for registry */
export type FieldComponent<T = unknown> = (props: FieldComponentProps<T>) => ReactNode;

/** Registry type: map field type string to component */
export type FieldRegistry = Map<FieldType, FieldComponent>;
