"use client";

import { memo, useCallback, useState } from "react";
import type { FieldComponentProps } from "../types";
import type { DropdownFieldConfig } from "../types";
import { cn } from "@/lib/utils/cn";

function DropdownFieldComponent({
  name,
  config,
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: FieldComponentProps<string | string[]>) {
  const cfg = config as DropdownFieldConfig;
  const options = Array.isArray(cfg.options)
    ? cfg.options
    : typeof cfg.options === "string"
      ? []
      : [];
  const mode = cfg.mode ?? "single";
  const isMulti = mode === "multi";
  const searchable = mode === "searchable";

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const current = value === undefined || value === null
    ? (isMulti ? [] : "")
    : isMulti
      ? (Array.isArray(value) ? value : [value])
      : String(value);

  const filtered = search
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(search.toLowerCase()) ||
          o.value.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const handleSelect = useCallback(
    (opt: { value: string; label: string }) => {
      if (isMulti) {
        const arr = Array.isArray(current) ? current : [];
        const next = arr.includes(opt.value)
          ? arr.filter((v) => v !== opt.value)
          : [...arr, opt.value];
        onChange(next as unknown as string);
      } else {
        onChange(opt.value as unknown as string);
        setOpen(false);
      }
      onBlur?.();
    },
    [isMulti, current, onChange, onBlur]
  );

  const displayLabel = isMulti
    ? ((Array.isArray(current) ? current : [])
        .map((v) => options.find((o) => o.value === v)?.label ?? v)
        .join(", ") || (cfg.placeholder ?? "Select..."))
    : (options.find((o) => o.value === current)?.label ?? current) || (cfg.placeholder ?? "Select...");

  const selectClass = cn(
    "mt-0 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2.5 text-sm text-gray-800 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 min-h-[44px]",
    error && "border-red-500",
    disabled && "opacity-60 cursor-not-allowed"
  );

  if (searchable || isMulti) {
    return (
      <div className="relative">
        <button
          type="button"
          id={`fr-${name}`}
          onClick={() => !disabled && setOpen((o) => !o)}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(selectClass, "text-left flex items-center justify-between")}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className="truncate">{displayLabel}</span>
          <span className="ml-2">▼</span>
        </button>
        {open && (
          <div
            className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg py-1 max-h-60 overflow-auto"
            role="listbox"
          >
            {searchable && (
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border-b border-gray-100 text-sm outline-none sticky top-0 bg-white"
              />
            )}
            {filtered.map((opt) => {
              const selected = isMulti
                ? (Array.isArray(current) && current.includes(opt.value))
                : current === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => handleSelect(opt)}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm hover:bg-gray-100",
                    selected && "bg-primary/10 text-primary"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <select
      id={`fr-${name}`}
      value={Array.isArray(current) ? current[0] : current}
      onChange={(e) => onChange(e.target.value as unknown as string)}
      onBlur={onBlur}
      disabled={disabled}
      aria-invalid={!!error}
      className={selectClass}
    >
      <option value="">{cfg.placeholder ?? "Select..."}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export const DropdownField = memo(DropdownFieldComponent);
