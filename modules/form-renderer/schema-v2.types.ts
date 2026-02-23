/**
 * Form Engine – Rule-driven schema v2
 * Scalable, plugin-compatible, future-proof layout config types.
 */

// ─── Condition (rule engine) ───────────────────────────────────────────────

export type ConditionOp =
  | "eq"
  | "neq"
  | "empty"
  | "notEmpty"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "in"
  | "contains";

/** Simple condition: one field vs value/operator */
export interface SimpleCondition {
  field: string;
  op?: ConditionOp;
  value?: unknown;
}

/** Composite condition: and/or of other conditions */
export interface CompositeCondition {
  and?: Condition[];
  or?: Condition[];
}

export type Condition = SimpleCondition | CompositeCondition;

export function isComposite(c: Condition): c is CompositeCondition {
  return "and" in c || "or" in c;
}

// ─── Validation rules (structured) ─────────────────────────────────────────

export interface RequiredRule {
  type: "required";
  message?: string;
}

export interface PatternRule {
  type: "pattern";
  pattern: string;
  message?: string;
}

export interface MinLengthRule {
  type: "minLength";
  value: number;
  message?: string;
}

export interface MaxLengthRule {
  type: "maxLength";
  value: number;
  message?: string;
}

export interface MinValueRule {
  type: "minValue";
  value: number;
  message?: string;
}

export interface MaxValueRule {
  type: "maxValue";
  value: number;
  message?: string;
}

export interface AsyncValidationRule {
  type: "async";
  key: string;
  endpoint?: string;
  trigger?: "blur" | "change" | "click";
  debounce?: number;
  message?: string;
}

export interface CustomValidationRule {
  type: "custom";
  validator: string;
  message?: string;
  params?: Record<string, unknown>;
}

export type ValidationRule =
  | RequiredRule
  | PatternRule
  | MinLengthRule
  | MaxLengthRule
  | MinValueRule
  | MaxValueRule
  | AsyncValidationRule
  | CustomValidationRule;

export interface ValidationConfig {
  rules: ValidationRule[];
}

// ─── Actions (button / event effects) ──────────────────────────────────────

export interface ValidateAction {
  type: "validate";
  /** Fields to validate; omit = current or all */
  fields?: string[];
}

export interface SetValueAction {
  type: "setValue";
  field: string;
  value: unknown;
}

export interface ApiAction {
  type: "api";
  endpoint: string;
  payloadMap?: Record<string, string>;
  onSuccess?: Action[];
  onError?: Action[];
}

export interface NavigateAction {
  type: "navigate";
  url: string;
}

export type Action = ValidateAction | SetValueAction | ApiAction | NavigateAction;

export interface FieldActionBinding {
  event: "click" | "blur" | "change";
  run: Action[];
}

// ─── Dynamic class toggling ───────────────────────────────────────────────

export interface ClassToggle {
  when: Condition;
  className: string;
}

// ─── Field config v2 (plugin-agnostic base) ────────────────────────────────

export type FieldTypeV2 =
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

export interface BaseFieldConfigV2 {
  /** Unique key for form state and API binding (replaces fieldName + key) */
  key: string;
  type: FieldTypeV2;
  label?: string;
  placeholder?: string;
  defaultValue?: unknown;
  /** Structured validation – no hardcoded mandatory/pattern in engine */
  validation?: ValidationConfig;
  /** Rule-driven visibility */
  visibleWhen?: Condition;
  /** Rule-driven disable */
  disabledWhen?: Condition;
  /** Dynamic class toggling by condition */
  classNameWhen?: ClassToggle[];
  /** Action effects (e.g. button click, blur validation) */
  actions?: FieldActionBinding[];
  /** For dependent dropdowns / load order */
  dependsOn?: string[];
  /** Extra plugin-specific options (size, fileTypes, etc.) */
  attr?: Record<string, unknown>;
}

// ─── Type-specific extensions ─────────────────────────────────────────────

export interface TextFieldConfigV2 extends BaseFieldConfigV2 {
  type: "text";
  subtype?: "mobile" | "email";
  attr?: {
    max?: number;
    helpText?: boolean;
    textData?: { class: string; text: string }[];
  };
}

export interface ButtonFieldConfigV2 extends BaseFieldConfigV2 {
  type: "button";
  /** Button label (replaces placeHolder for buttons) */
  label: string;
  actions?: FieldActionBinding[];
  attr?: { disable?: boolean };
}

export interface FileFieldConfigV2 extends BaseFieldConfigV2 {
  type: "file";
  attr?: {
    size?: number; // MB
    fileTypes?: string; // ".jpg,.pdf"
    fileMimeTypes?: string; // "image/jpeg,application/pdf"
  };
}

export interface CurrencyFieldConfigV2 extends BaseFieldConfigV2 {
  type: "currency";
  attr?: { currency?: string; minValue?: number; maxValue?: number };
}

export type FieldConfigV2 =
  | TextFieldConfigV2
  | ButtonFieldConfigV2
  | FileFieldConfigV2
  | CurrencyFieldConfigV2
  | (BaseFieldConfigV2 & { type: Exclude<FieldTypeV2, "text" | "button" | "file" | "currency"> });

// ─── Layout config v2 ─────────────────────────────────────────────────────

export interface FormLayoutConfigV2 {
  formId: string;
  /** Optional sections for grouping; flat list if omitted */
  sections?: { id?: string; title?: string; fields: FieldConfigV2[] }[];
  /** Flat list of fields (alternative to sections) */
  layoutConfig?: FieldConfigV2[];
}
