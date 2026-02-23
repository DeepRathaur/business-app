"use client";

import { memo, useCallback } from "react";
import { getFieldRegistry } from "./fields/registry";
import { FieldWrapper } from "./components/FieldWrapper";
import { useFormRendererContext } from "./FormRendererContext";
import type { FieldConfig } from "./types";

interface FieldRendererProps {
  config: FieldConfig;
}

function FieldRendererComponent({ config }: FieldRendererProps) {
  const { values, errors, setValue, setError, getVisible, getDisabled, validateFieldValue, validating } =
    useFormRendererContext();

  const name = config.name;
  const value = values[name];
  const error = errors[name];
  const visible = getVisible(config);
  const disabled = getDisabled(config);
  const isValidating = validating[name] ?? false;

  const onChange = useCallback(
    (v: unknown) => {
      setValue(name, v);
      const err = validateFieldValue(name, v, config);
      setError(name, err);
    },
    [name, setValue, setError, validateFieldValue, config]
  );

  const onBlur = useCallback(() => {
    const err = validateFieldValue(name, value, config);
    setError(name, err);
  }, [name, value, validateFieldValue, config, setError]);

  const registry = getFieldRegistry();
  const FieldComponent = registry.get(config.type);
  if (!FieldComponent) {
    return (
      <FieldWrapper config={config} error={`Unknown field type: ${config.type}`} visible={visible}>
        <span className="text-sm text-red-500">Unknown field type: {config.type}</span>
      </FieldWrapper>
    );
  }

  return (
    <FieldWrapper config={config} error={error} visible={visible} disabled={disabled}>
      <FieldComponent
        name={name}
        config={config}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error ?? undefined}
        disabled={disabled}
        visible={visible}
        validating={isValidating}
      />
    </FieldWrapper>
  );
}

export const FieldRenderer = memo(FieldRendererComponent);
