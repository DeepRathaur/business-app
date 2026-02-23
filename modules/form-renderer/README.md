# Form Renderer Module

Configuration-driven dynamic form renderer with plugin-based field types, validation, and mobile-optimized UI.

## Folder structure

```
modules/form-renderer/
├── index.ts                 # Public API
├── types.ts                # Type definitions
├── FormRenderer.tsx        # Core form component
├── FormRendererContext.tsx # Form state & visibility
├── FieldRenderer.tsx       # Renders one field via registry
├── validation/
│   ├── errorHandler.ts     # Form/field validation
│   └── validators.ts       # Sync validators
├── fields/
│   ├── registry.ts         # Plugin registry
│   ├── TextField.tsx
│   ├── TextAreaField.tsx
│   ├── NumberField.tsx
│   ├── FileField.tsx
│   ├── DropdownField.tsx
│   ├── DateField.tsx
│   ├── DateRangeField.tsx
│   ├── RadioField.tsx
│   ├── CheckboxField.tsx
│   ├── ButtonField.tsx
│   ├── CurrencyField.tsx
│   ├── HiddenField.tsx
│   └── DisabledField.tsx
├── components/
│   ├── FieldWrapper.tsx    # Label + error wrapper
│   └── FieldSkeleton.tsx   # Loading skeleton
└── examples/
    ├── layoutConfig.example.json
    ├── FormRendererExample.tsx
    └── ADD_NEW_FIELD_PLUGIN.md
```

## Supported field types

| Type        | Features |
|------------|----------|
| text       | Optional `subtype: "mobile"` (numbers only, min/max length); pattern; apiValidation (blur/click) |
| textArea   | rows, minLength, maxLength, pattern |
| number     | minValue, maxValue, step |
| file       | single/multiple, drag & drop, maxSize, allowedTypes, showPreview, allowRemove |
| dropdown   | single / multi / searchable, dynamic options |
| date       | minDate, maxDate, calendar (native) |
| dateRange  | startName, endName |
| radio      | options array |
| checkbox   | checkboxLabel |
| button     | buttonLabel, buttonType (button/submit) |
| currency   | currency code, min/max value |
| hidden     | value only |
| disabled   | read-only display |

## Usage

```tsx
import { FormRenderer } from "@/modules/form-renderer";
import type { FormLayoutConfig, FormValues } from "@/modules/form-renderer";

const config: FormLayoutConfig = {
  formId: "my-form",
  submitLabel: "Save",
  sections: [
    {
      id: "section1",
      title: "Details",
      fields: [
        { name: "email", type: "text", label: "Email", required: true },
        { name: "amount", type: "currency", label: "Amount", currency: "KES" },
      ],
    },
  ],
};

export function MyForm() {
  const handleSubmit = (values: FormValues) => {
    console.log(values);
  };

  return (
    <FormRenderer
      config={config}
      initialValues={{ email: "" }}
      onSubmit={handleSubmit}
      submitLabel="Save"
    />
  );
}
```

## Dynamic show/hide and disable

Use `showWhen` and `disableWhen` on any field:

```json
{
  "name": "other",
  "type": "text",
  "label": "Other",
  "showWhen": { "field": "choice", "value": "other" }
}
```

Operators: `eq`, `neq`, `empty`, `notEmpty`.

## Validation

- **Required**: `required: true`, optional `requiredMessage`
- **Pattern**: `pattern: { "pattern": "^...$", "message": "..." }`
- **Length**: `minLength`, `maxLength`
- **Range**: `minValue`, `maxValue` (number/currency)
- Errors show below the field; real-time on change/blur.

## Adding a new field type (plugin)

See [examples/ADD_NEW_FIELD_PLUGIN.md](./examples/ADD_NEW_FIELD_PLUGIN.md).

## Performance

- Fields are memoized; context updates still cause re-renders of all fields. For very large forms, consider splitting sections into separate context providers or integrating React Hook Form with `register` per field for minimal re-renders.
