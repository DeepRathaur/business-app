# Adding a New Field Type (Plugin)

## 1. Create the field component

Create a new file under `modules/form-renderer/fields/`, e.g. `MyField.tsx`:

```tsx
"use client";

import { memo, useCallback } from "react";
import type { FieldComponentProps } from "../types";
import { cn } from "@/lib/utils/cn";

function MyFieldComponent({
  name,
  config,
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: FieldComponentProps<string>) {
  const val = value === undefined || value === null ? "" : String(value);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  );

  return (
    <input
      id={`fr-${name}`}
      type="text"
      value={val}
      onChange={handleChange}
      onBlur={onBlur}
      disabled={disabled}
      aria-invalid={!!error}
      className={cn("w-full rounded-md border px-3 py-2", error && "border-red-500")}
    />
  );
}

export const MyField = memo(MyFieldComponent);
```

## 2. Extend types (optional)

In `modules/form-renderer/types.ts`:

- Add the new type to the `FieldType` union: `| "myField"`.
- Add a config interface if needed, e.g. `MyFieldConfig extends BaseFieldConfig { type: "myField"; ... }`.
- Add it to the `FieldConfig` union.

## 3. Register the field

In `modules/form-renderer/fields/registry.ts`:

- Import your component: `import { MyField } from "./MyField";`
- Add to `defaultRegistry`: `["myField", MyField as AnyFieldComponent]`

## 4. Use in layoutConfig

In your JSON config:

```json
{
  "name": "myFieldName",
  "type": "myField",
  "label": "My field",
  "required": true
}
```

## 5. (Alternative) Register at runtime

You can register without editing the registry file:

```ts
import { registerField } from "@/modules/form-renderer";
import { MyField } from "./MyField";

registerField("myField", MyField);
```

Call this once at app init (e.g. in a layout or provider) before rendering forms that use `myField`.
