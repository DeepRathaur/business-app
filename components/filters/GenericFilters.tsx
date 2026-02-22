"use client";

import React, { useState } from "react";

interface GenericFiltersProps {
  onFilterChange: (filters: Record<string, string>) => void;
}

/**
 * GenericFilters - Floating filter button
 * Simplified: opens a filter panel; for now placeholder
 */
export default function GenericFilters({ onFilterChange }: GenericFiltersProps) {
  const [open, setOpen] = useState(false);

  const handleApply = (filters: Record<string, string>) => {
    onFilterChange(filters);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-4 z-30">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-50"
        aria-label="Filters"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </button>
      {open && (
        <div className="absolute bottom-14 right-0 w-48 p-3 bg-white rounded-lg shadow-xl">
          <p className="text-xs text-neutral-500 mb-2">Filters (coming soon)</p>
          <button
            type="button"
            onClick={() => handleApply({})}
            className="text-xs text-primary font-medium"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
