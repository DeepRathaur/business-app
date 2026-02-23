"use client";

import { memo, useCallback, useRef, useState } from "react";
import type { FieldComponentProps } from "../types";
import type { FileFieldConfig } from "../types";
import { cn } from "@/lib/utils/cn";

function FileFieldComponent({
  name,
  config,
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: FieldComponentProps<FileList | File[] | null>) {
  const cfg = config as FileFieldConfig;
  const multiple = cfg.multiple ?? false;
  const dragDrop = cfg.dragDrop ?? true;
  const showPreview = cfg.showPreview ?? true;
  const allowRemove = cfg.allowRemove ?? true;
  const accept = cfg.accept;
  const maxSize = cfg.maxSize;
  const maxFiles = cfg.maxFiles;
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const files: File[] = value instanceof FileList ? Array.from(value) : Array.isArray(value) ? value : [];

  const validateFile = useCallback(
    (file: File): string | null => {
      if (maxSize != null && file.size > maxSize)
        return `File size must be under ${Math.round(maxSize / 1024)}KB`;
      if (cfg.allowedTypes?.length) {
        const ok = cfg.allowedTypes.some((t) => {
          if (t.endsWith("/*")) return file.type.startsWith(t.replace("/*", ""));
          return file.type === t;
        });
        if (!ok) return "File type not allowed";
      }
      return null;
    },
    [maxSize, cfg.allowedTypes]
  );

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles?.length) {
        onChange(null);
        return;
      }
      const list = Array.from(newFiles);
      const err = list.map(validateFile).find(Boolean);
      if (err) {
        setPreviewError(err);
        return;
      }
      setPreviewError(null);
      if (maxFiles != null && list.length > maxFiles) {
        onChange(list.slice(0, maxFiles) as unknown as FileList);
      } else {
        onChange(list as unknown as FileList);
      }
      onBlur?.();
    },
    [onChange, onBlur, validateFile, maxFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files),
    [handleFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const removeFile = useCallback(
    (index: number) => {
      const next = files.filter((_, i) => i !== index);
      onChange(next.length ? (next as unknown as FileList) : null);
    },
    [files, onChange]
  );

  const zoneClass = cn(
    "mt-0 w-full rounded-md border-2 border-dashed px-4 py-6 text-center text-sm text-gray-500 transition-colors",
    dragActive && "border-primary bg-primary/5",
    !dragActive && "border-gray-300 hover:border-gray-400",
    error && "border-red-500",
    disabled && "opacity-60 cursor-not-allowed"
  );

  return (
    <div className="space-y-2">
      {dragDrop ? (
        <div
          className={zoneClass}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            id={`fr-${name}`}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={handleChange}
            onBlur={onBlur}
            disabled={disabled}
            className="hidden"
            aria-invalid={!!error}
          />
          {files.length ? `${files.length} file(s) selected` : "Drop files or click to browse"}
        </div>
      ) : (
        <input
          id={`fr-${name}`}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          className="block w-full text-sm text-gray-600 file:mr-3 file:rounded file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm"
          aria-invalid={!!error}
        />
      )}
      {(previewError || error) && (
        <p className="text-sm text-red-500">{previewError ?? error}</p>
      )}
      {showPreview && files.length > 0 && (
        <ul className="space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between text-sm text-gray-700">
              <span className="truncate">{f.name}</span>
              {allowRemove && (
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-red-500 hover:underline ml-2"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export const FileField = memo(FileFieldComponent);
