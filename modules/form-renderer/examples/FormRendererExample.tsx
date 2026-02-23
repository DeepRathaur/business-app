"use client";

import { useCallback } from "react";
import { FormRenderer } from "../FormRenderer";
import type { FormLayoutConfig, FormValues } from "../types";
import layoutConfigExample from "./layoutConfig.example.json";

const config = layoutConfigExample as FormLayoutConfig;

export function FormRendererExample() {
  const handleSubmit = useCallback((values: FormValues) => {
    console.log("Form submitted:", values);
    alert(JSON.stringify(values, null, 2));
  }, []);

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded-xl shadow-card">
      <h1 className="text-lg font-semibold text-gray-800 mb-4">Form Renderer Example</h1>
      <FormRenderer
        config={config}
        initialValues={{ agree: false }}
        onSubmit={handleSubmit}
        submitLabel="Submit"
      />
    </div>
  );
}
