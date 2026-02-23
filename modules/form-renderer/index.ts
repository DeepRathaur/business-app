/**
 * Form Renderer - Public API
 * Configuration-driven dynamic forms with plugin-based field types.
 */

export { FormRenderer, type FormRendererProps } from "./FormRenderer";
export { FormRendererProvider, useFormRendererContext } from "./FormRendererContext";
export { FieldRenderer } from "./FieldRenderer";
export { FieldWrapper } from "./components/FieldWrapper";
export { FieldSkeleton } from "./components/FieldSkeleton";
export { getFieldRegistry, registerField, resetFieldRegistry } from "./fields/registry";
export { validateForm, validateField } from "./validation/errorHandler";
export type { FormValues, ErrorHandlerResult } from "./validation/errorHandler";

export type {
  FormLayoutConfig,
  LayoutSection,
  FieldConfig,
  FieldType,
  FieldComponentProps,
  BaseFieldConfig,
  VisibilityCondition,
  FileFieldConfig,
  DropdownFieldConfig,
  DateFieldConfig,
  DateRangeFieldConfig,
} from "./types";
