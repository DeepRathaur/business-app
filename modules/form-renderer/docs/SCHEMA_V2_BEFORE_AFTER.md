# Form Engine – Schema v2: Before vs After

## 1. Before (current layoutConfig)

```json
"layoutConfig": [
  {
    "fieldName": "q1",
    "fieldType": "text",
    "pattern": "^[0-9]+$",
    "mandatory": true,
    "fieldValue": "",
    "placeHolder": "Mobile No",
    "minlength": 10,
    "key": "mobileNo",
    "action": {
      "isAction": true,
      "eventType": "click",
      "actionText": "Validate"
    },
    "attr": { "max": 10, "helpText": true, "textData": [] }
  },
  {
    "fieldName": "q2",
    "fieldType": "text",
    "pattern": "^[A-Z0-9]+$",
    "mandatory": true,
    "placeHolder": "Account No",
    "key": "accountNo",
    "attr": { "disable": true }
  },
  {
    "fieldName": "q7",
    "fieldType": "button",
    "key": "airtimeButton",
    "placeHolder": "Buy Airtime",
    "action": { "isAction": true, "eventType": "click" }
  }
]
```

**Issues:**
- Mixed naming: `fieldName` vs `key`, `placeHolder` vs `placeholder`, `mandatory` vs `required`.
- Validation is ad-hoc: `pattern`, `mandatory`, `minlength` scattered; no structured rules, no async/API validation shape.
- No rule engine: visibility/disable are implicit (e.g. `attr.disable`) or missing; no conditional show/hide, no cross-field rules.
- Actions are opaque: `actionText: "Validate"` is not machine-readable; no clear “run this API” or “set this field”.
- Hard to extend: new validations or behaviours require engine changes.

---

## 2. After (schema v2 – rule-driven)

Same intent, improved structure:

```json
{
  "formId": "sr-form",
  "layoutConfig": [
    {
      "key": "mobileNo",
      "type": "text",
      "label": "Mobile No",
      "placeholder": "Mobile No",
      "defaultValue": "",
      "validation": {
        "rules": [
          { "type": "required", "message": "Mobile number is required" },
          { "type": "pattern", "pattern": "^[0-9]+$", "message": "Numbers only" },
          { "type": "minLength", "value": 10, "message": "Min 10 digits" },
          { "type": "maxLength", "value": 10, "message": "Max 10 digits" },
          { "type": "async", "key": "validateMobile", "trigger": "click", "message": "Invalid mobile" }
        ]
      },
      "actions": [
        {
          "event": "click",
          "run": [
            { "type": "validate", "fields": ["mobileNo"] },
            { "type": "api", "endpoint": "/api/validate-mobile", "payloadMap": { "mobile": "mobileNo" } }
          ]
        }
      ],
      "attr": { "max": 10, "helpText": true }
    },
    {
      "key": "accountNo",
      "type": "text",
      "label": "Account No",
      "placeholder": "Account No",
      "validation": { "rules": [{ "type": "required" }, { "type": "pattern", "pattern": "^[A-Z0-9]+$" }] },
      "disabledWhen": { "field": "accountNo", "op": "notEmpty" }
    },
    {
      "key": "airtimeButton",
      "type": "button",
      "label": "Buy Airtime",
      "actions": [
        {
          "event": "click",
          "run": [
            { "type": "validate", "fields": ["mobileNo", "accountNo"] },
            { "type": "api", "endpoint": "/api/buy-airtime" }
          ]
        }
      ]
    }
  ]
}
```

---

## 3. Improvements at a glance

| Goal | Before | After |
|------|--------|--------|
| **Scalable** | Flat ad-hoc keys | Single `key`, consistent naming, `validation.rules[]` |
| **Rule-driven** | No conditions | `visibleWhen`, `disabledWhen`, `classNameWhen` with `Condition` (and/or, eq, empty, etc.) |
| **Fully dynamic** | Static attr | Conditions + actions drive show/hide, disable, class, API calls |
| **Plugin-compatible** | fieldType + attr | `type` + `attr`; engine only evaluates rules, no field-specific logic |
| **Future-proof** | New behaviour = code change | New validator/action types registered; config stays declarative |
| **Conditional visibility** | Not supported | `visibleWhen: Condition` |
| **Dynamic enable/disable** | `attr.disable` only | `disabledWhen: Condition` |
| **Cross-field / button effects** | Opaque action text | `actions[].run`: validate, setValue, api, navigate |
| **Async validation** | Not defined | `validation.rules[]` with `type: "async"`, trigger, endpoint |
| **Structured validation** | Scattered pattern/mandatory | Single `validation.rules[]` (required, pattern, minLength, maxLength, minValue, maxValue, async, custom) |
| **Dynamic class toggling** | Not supported | `classNameWhen: [{ when: Condition, className: "..." }]` |

---

## 4. Condition (rule engine)

**Simple:** one field, one op, optional value.

```json
{ "field": "country", "op": "eq", "value": "KE" }
{ "field": "mobileNo", "op": "empty" }
{ "field": "amount", "op": "gte", "value": 100 }
```

**Composite:** and/or of conditions.

```json
{
  "and": [
    { "field": "product", "op": "notEmpty" },
    { "field": "agree", "op": "eq", "value": true }
  ]
}
```

**Used in:**
- `visibleWhen` – show field only when condition is true.
- `disabledWhen` – disable field when condition is true.
- `classNameWhen[].when` – apply class when condition is true.

No hardcoded field logic: engine has one “evaluate Condition against form values” function.

---

## 5. Validation rules (structured)

All validation lives under `validation.rules[]`. Engine dispatches by `type`; no special handling per field.

| type | shape | purpose |
|------|--------|--------|
| `required` | `{ type: "required", message? }` | Not empty |
| `pattern` | `{ type: "pattern", pattern, message? }` | Regex |
| `minLength` / `maxLength` | `{ type, value: number, message? }` | Length |
| `minValue` / `maxValue` | `{ type, value: number, message? }` | Numeric range |
| `async` | `{ type: "async", key, endpoint?, trigger?, message? }` | API / async validation |
| `custom` | `{ type: "custom", validator: string, params?, message? }` | Plugin validator by key |

Example: mobile with required + pattern + length + async on click:

```json
"validation": {
  "rules": [
    { "type": "required" },
    { "type": "pattern", "pattern": "^[0-9]+$" },
    { "type": "minLength", "value": 10 },
    { "type": "maxLength", "value": 10 },
    { "type": "async", "key": "validateMobile", "trigger": "click" }
  ]
}
```

---

## 6. Actions (button / event effects)

Replaces opaque `action.actionText` with a list of runnable actions.

| type | shape | purpose |
|------|--------|--------|
| `validate` | `{ type: "validate", fields?: string[] }` | Run validation on fields or form |
| `setValue` | `{ type: "setValue", field, value }` | Set another field’s value |
| `api` | `{ type: "api", endpoint, payloadMap?, onSuccess?, onError? }` | Call API; optional chained actions |
| `navigate` | `{ type: "navigate", url }` | Navigate |

Example: button that validates then calls API:

```json
"actions": [
  {
    "event": "click",
    "run": [
      { "type": "validate", "fields": ["mobileNo"] },
      { "type": "api", "endpoint": "/api/validate-mobile", "payloadMap": { "mobile": "mobileNo" } }
    ]
  }
]
```

Supports cross-field and button-triggered state changes without hardcoded logic.

---

## 7. Full migrated example (your 10 fields)

```json
{
  "formId": "sr-form",
  "layoutConfig": [
    {
      "key": "mobileNo",
      "type": "text",
      "label": "Mobile No",
      "placeholder": "Mobile No",
      "defaultValue": "",
      "validation": {
        "rules": [
          { "type": "required", "message": "Mobile number is required" },
          { "type": "pattern", "pattern": "^[0-9]+$", "message": "Numbers only" },
          { "type": "minLength", "value": 10 },
          { "type": "maxLength", "value": 10 },
          { "type": "async", "key": "validateMobile", "trigger": "click", "message": "Invalid mobile" }
        ]
      },
      "actions": [{ "event": "click", "run": [{ "type": "validate", "fields": ["mobileNo"] }, { "type": "api", "endpoint": "/api/validate-mobile", "payloadMap": { "mobile": "mobileNo" } }] }],
      "attr": { "max": 10, "helpText": true }
    },
    {
      "key": "accountNo",
      "type": "text",
      "placeholder": "Account No",
      "validation": { "rules": [{ "type": "required" }, { "type": "pattern", "pattern": "^[A-Z0-9]+$" }] },
      "disabledWhen": { "field": "accountNo", "op": "notEmpty" }
    },
    {
      "key": "serviceType",
      "type": "text",
      "placeholder": "Service Type",
      "validation": { "rules": [{ "type": "required" }, { "type": "pattern", "pattern": "^[A-Za-z0-9 .'#-@%&/]+$" }] },
      "disabledWhen": { "field": "serviceType", "op": "notEmpty" }
    },
    {
      "key": "lineType",
      "type": "text",
      "placeholder": "Line Type",
      "validation": { "rules": [{ "type": "required" }, { "type": "pattern", "pattern": "^[A-Za-z0-9 .'#-@%&/]+$" }] },
      "disabledWhen": { "field": "lineType", "op": "notEmpty" }
    },
    {
      "key": "airtime",
      "type": "text",
      "placeholder": "Airtime",
      "validation": { "rules": [{ "type": "minValue", "value": 10 }, { "type": "maxValue", "value": 1000000000 }] },
      "visibleWhen": { "field": "airtime", "op": "notEmpty" },
      "attr": { "currency": true, "hidden": true }
    },
    {
      "key": "product",
      "type": "text",
      "placeholder": "Product",
      "validation": { "rules": [{ "type": "minLength", "value": 3 }, { "type": "maxLength", "value": 50 }, { "type": "pattern", "pattern": "^[A-ZÀ-ÿa-z0-9-àèùìòâêîôûëïüÿæœçé ,-:_@&()|.]{1,50}$" }] },
      "attr": { "max": 50, "hidden": true }
    },
    {
      "key": "airtimeButton",
      "type": "button",
      "label": "Buy Airtime",
      "actions": [{ "event": "click", "run": [{ "type": "validate" }, { "type": "api", "endpoint": "/api/buy-airtime" }] }]
    },
    {
      "key": "productButton",
      "type": "button",
      "label": "Base Plan / Buy Product",
      "actions": [{ "event": "click", "run": [{ "type": "validate" }, { "type": "api", "endpoint": "/api/buy-product" }] }]
    },
    {
      "key": "remarks",
      "type": "textArea",
      "placeholder": "Description",
      "validation": { "rules": [{ "type": "minLength", "value": 3 }, { "type": "maxLength", "value": 500 }, { "type": "pattern", "pattern": "[À-ÿA-Za-z0-9-àèùìòâêîôûëïüÿæœçé ,-:_@&()|.'#%/]{1,500}" }] },
      "attr": { "max": 500 }
    },
    {
      "key": "attachment",
      "type": "file",
      "placeholder": "Attachment",
      "validation": { "rules": [{ "type": "pattern", "pattern": "^[A-Za-z0-9 .'#-@%&/]+$" }] },
      "attr": {
        "size": 10,
        "fileTypes": ".jpg,.jpeg,.pdf,.txt,.csv,.xls,.xlsx",
        "fileMimeTypes": "text/plain,application/pdf,image/jpeg,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
    }
  ]
}
```

---

## 8. Why this is better

1. **Single source of truth per field:** `key` for identity; `type` for plugin; `validation.rules` for all checks.
2. **No hardcoded field logic:** Visibility, disable, and class depend only on `Condition`; validation on `ValidationRule`; effects on `Action`. New behaviour = new rule/action types + registry.
3. **Structured validation:** Same format for required, pattern, length, range, async, custom; easy to add validators without touching existing config shape.
4. **Explicit actions:** Button and event behaviour is declarative (validate, api, setValue, navigate); no parsing of “actionText”.
5. **Conditional UX:** `visibleWhen` / `disabledWhen` / `classNameWhen` support cross-field and composite rules.
6. **Dependent dropdowns / ordering:** `dependsOn` gives load order and dependency; options can be driven by API using action/async.
7. **Enterprise-grade:** Consistent naming, typed in TypeScript, minimal and extensible.

---

## 9. TypeScript types

See **`modules/form-renderer/schema-v2.types.ts`** for:

- `Condition`, `SimpleCondition`, `CompositeCondition`
- `ValidationRule`, `ValidationConfig`
- `Action`, `FieldActionBinding`
- `BaseFieldConfigV2`, `FieldConfigV2`, `FormLayoutConfigV2`
- Helpers such as `isComposite(c)` for walking conditions.

Use these types in the Form Engine to parse and evaluate v2 configs; keep existing v1 support behind an adapter if needed.

---

## 10. Adapter: v2 → current FormRenderer

To use v2 config with the existing FormRenderer, add a thin adapter that:

- Maps `key` → `name`, `placeholder` → `placeholder`, `defaultValue` → `defaultValue`.
- Derives `required` from a rule `{ type: "required" }` in `validation.rules`.
- Derives `pattern` / `minLength` / `maxLength` / `minValue` / `maxValue` from the corresponding rules.
- Maps `visibleWhen` (simple `Condition`) → `showWhen: { field, op, value }`.
- Maps `disabledWhen` → `disableWhen`.
- Maps `actions[].run` to `onEventHandler` or a custom action runner; async rule with `trigger: "click"` can drive the “Validate” button behaviour for mobile.
