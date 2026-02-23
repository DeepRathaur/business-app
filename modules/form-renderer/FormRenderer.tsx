"use client";

import { memo } from "react";
import { FormRendererProvider, useFormRendererContext } from "./FormRendererContext";
import { FieldRenderer } from "./FieldRenderer";
import type { FormLayoutConfig, FormValues } from "./types";
import { validateForm } from "./validation/errorHandler";
import { cn } from "@/lib/utils/cn";

export interface FormRendererProps {
  config: FormLayoutConfig;
  initialValues?: FormValues;
  onSubmit?: (values: FormValues) => void;
  loading?: boolean;
  className?: string;
  /** Custom submit button label (overrides config.submitLabel) */
  submitLabel?: string;
}

function FormRendererInner({
  onSubmit,
  loading,
  submitLabel,
  className,
}: Omit<FormRendererProps, "config" | "initialValues"> & { config: FormLayoutConfig }) {
  const { config, values, errors, setError } = useFormRendererContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateForm(values, config);
    if (!result.isValid) {
      Object.entries(result.errors).forEach(([name, err]) => setError(name, err));
      return;
    }
    onSubmit?.(values);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-5", className)} noValidate>
      {config.sections.map((section, sIdx) => (
        <fieldset key={section.id ?? sIdx} className="space-y-4">
          {section.title && (
            <legend className="text-sm font-semibold text-gray-800 mb-2">{section.title}</legend>
          )}
          <div
            className={
              section.columns === 2
                ? "grid gap-4 grid-cols-1 md:grid-cols-2"
                : section.columns && section.columns > 2
                  ? "grid gap-4 grid-cols-1 md:grid-cols-3"
                  : "space-y-4"
            }
          >
            {section.fields.map((field) => (
              <FieldRenderer key={field.name} config={field} />
            ))}
          </div>
        </fieldset>
      ))}
      {config.submitLabel !== undefined || submitLabel ? (
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#141a2a] text-white py-3 text-sm font-medium hover:opacity-95 disabled:opacity-50 min-h-[44px]"
          >
            {loading ? "..." : submitLabel ?? config.submitLabel ?? "Submit"}
          </button>
        </div>
      ) : null}
    </form>
  );
}

const FormRendererInnerMemo = memo(FormRendererInner);

function FormRendererComponent({
  config,
  initialValues,
  onSubmit,
  loading = false,
  className,
  submitLabel,
}: FormRendererProps) {
  return (
    <FormRendererProvider config={config} initialValues={initialValues}>
      <FormRendererInnerMemo
        config={config}
        onSubmit={onSubmit}
        loading={loading}
        submitLabel={submitLabel}
        className={className}
      />
    </FormRendererProvider>
  );
}

export const FormRenderer = memo(FormRendererComponent);
