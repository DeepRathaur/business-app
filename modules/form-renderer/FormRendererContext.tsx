"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { FormLayoutConfig, FormValues, FieldConfig, VisibilityCondition } from "./types";
import { validateField } from "./validation/errorHandler";

interface FormRendererContextValue {
  config: FormLayoutConfig;
  values: FormValues;
  errors: Record<string, string>;
  setValue: (name: string, value: unknown) => void;
  setError: (name: string, error: string | null) => void;
  getVisible: (field: FieldConfig) => boolean;
  getDisabled: (field: FieldConfig) => boolean;
  validateFieldValue: (name: string, value: unknown, fieldConfig: FieldConfig) => string | null;
  validating: Record<string, boolean>;
  setValidating: (name: string, v: boolean) => void;
}

const FormRendererContext = createContext<FormRendererContextValue | null>(null);

function evalCondition(condition: VisibilityCondition, values: FormValues): boolean {
  const v = values[condition.field];
  if (condition.operator === "empty") return v === undefined || v === null || v === "";
  if (condition.operator === "notEmpty") return v !== undefined && v !== null && v !== "";
  if (condition.operator === "neq") return v !== condition.value;
  return v === condition.value;
}

export function FormRendererProvider({
  config,
  initialValues = {},
  children,
}: {
  config: FormLayoutConfig;
  initialValues?: FormValues;
  children: React.ReactNode;
}) {
  const [values, setValues] = useState<FormValues>(() => {
    const next: FormValues = { ...initialValues };
    for (const section of config.sections) {
      for (const field of section.fields) {
        if (field.defaultValue !== undefined && next[field.name] === undefined) {
          next[field.name] = field.defaultValue;
        }
      }
    }
    return next;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validating, setValidatingState] = useState<Record<string, boolean>>({});

  const setValue = useCallback((name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  const setError = useCallback((name: string, error: string | null) => {
    setErrors((prev) => {
      if (error === null) {
        const { [name]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [name]: error };
    });
  }, []);

  const getVisible = useCallback(
    (field: FieldConfig) => {
      const showWhen = (field as { showWhen?: VisibilityCondition }).showWhen;
      if (!showWhen) return true;
      return evalCondition(showWhen, values);
    },
    [values]
  );

  const getDisabled = useCallback(
    (field: FieldConfig) => {
      const disableWhen = (field as { disableWhen?: VisibilityCondition }).disableWhen;
      if (!disableWhen) return false;
      return evalCondition(disableWhen, values);
    },
    [values]
  );

  const validateFieldValue = useCallback((name: string, value: unknown, fieldConfig: FieldConfig) => {
    return validateField(value, fieldConfig);
  }, []);

  const setValidating = useCallback((name: string, v: boolean) => {
    setValidatingState((prev) => ({ ...prev, [name]: v }));
  }, []);

  const value = useMemo(
    () => ({
      config,
      values,
      errors,
      setValue,
      setError,
      getVisible,
      getDisabled,
      validateFieldValue,
      validating,
      setValidating,
    }),
    [
      config,
      values,
      errors,
      setValue,
      setError,
      getVisible,
      getDisabled,
      validateFieldValue,
      validating,
      setValidating,
    ]
  );

  return (
    <FormRendererContext.Provider value={value}>
      {children}
    </FormRendererContext.Provider>
  );
}

export function useFormRendererContext(): FormRendererContextValue {
  const ctx = useContext(FormRendererContext);
  if (!ctx) throw new Error("useFormRendererContext must be used inside FormRendererProvider");
  return ctx;
}
