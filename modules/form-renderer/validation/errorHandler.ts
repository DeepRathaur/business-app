/**
 * Form Renderer - Error handling module
 * Centralized validation and error state. Used by FormRenderer and fields.
 */

import type { FieldConfig, FormLayoutConfig } from "../types";
import { runFieldValidators } from "./validators";

export type FormValues = Record<string, unknown>;

export interface ErrorHandlerResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Run sync validation for entire form and return errors map.
 */
export function validateForm(
  values: FormValues,
  config: FormLayoutConfig
): ErrorHandlerResult {
  const errors: Record<string, string> = {};

  for (const section of config.sections) {
    for (const field of section.fields) {
      if (field.type === "hidden" || field.type === "button") continue;
      const value = values[field.name];
      const err = runFieldValidators(value, field);
      if (err) errors[field.name] = err;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Run sync validation for a single field.
 */
export function validateField(
  value: unknown,
  config: FieldConfig
): string | null {
  if (config.type === "hidden" || config.type === "button") return null;
  return runFieldValidators(value, config);
}
