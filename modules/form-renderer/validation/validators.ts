/**
 * Form Renderer - Built-in validators
 * Sync validators used by error handler. Async/API validation is handled per-field.
 */

import type { FieldConfig, PatternValidation, LengthValidation, RangeValidation } from "../types";

export function requiredFail(value: unknown, config: FieldConfig): string | null {
  const message = (config as { requiredMessage?: string }).requiredMessage ?? "This field is required";
  if (value === undefined || value === null) return message;
  if (typeof value === "string" && value.trim() === "") return message;
  if (Array.isArray(value) && value.length === 0) return message;
  return null;
}

export function pattern(value: unknown, patternConfig: PatternValidation): string | null {
  if (value === undefined || value === null || value === "") return null;
  const str = String(value);
  try {
    const regex = new RegExp(patternConfig.pattern);
    return regex.test(str) ? null : patternConfig.message;
  } catch {
    return null;
  }
}

export function minLength(value: unknown, min: number, message?: string): string | null {
  if (value === undefined || value === null) return null;
  const str = String(value);
  return str.length < min ? (message ?? `Min length is ${min}`) : null;
}

export function maxLength(value: unknown, max: number, message?: string): string | null {
  if (value === undefined || value === null) return null;
  const str = String(value);
  return str.length > max ? (message ?? `Max length is ${max}`) : null;
}

export function minValue(value: unknown, min: number, message?: string): string | null {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return num < min ? (message ?? `Min value is ${min}`) : null;
}

export function maxValue(value: unknown, max: number, message?: string): string | null {
  if (value === undefined || value === null || value === "") return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  return num > max ? (message ?? `Max value is ${max}`) : null;
}

export function runFieldValidators(
  value: unknown,
  config: FieldConfig
): string | null {
  const base = config as BaseFieldConfig & Record<string, unknown>;
  if (base.required) {
    const reqErr = requiredFail(value, config);
    if (reqErr) return reqErr;
  }

  if (typeof value === "string" || typeof value === "number") {
    if (base.pattern) {
      const err = pattern(value, base.pattern as PatternValidation);
      if (err) return err;
    }
    if (base.minLength != null) {
      const err = minLength(value, base.minLength, (base as LengthValidation).message);
      if (err) return err;
    }
    if (base.maxLength != null) {
      const err = maxLength(value, base.maxLength, (base as LengthValidation).message);
      if (err) return err;
    }
    if (base.minValue != null || base.maxValue != null) {
      const range = base as unknown as RangeValidation;
      if (range.minValue != null) {
        const err = minValue(value, range.minValue, range.message);
        if (err) return err;
      }
      if (range.maxValue != null) {
        const err = maxValue(value, range.maxValue, range.message);
        if (err) return err;
      }
    }
  }
  return null;
}

interface BaseFieldConfig {
  required?: boolean;
  requiredMessage?: string;
}
