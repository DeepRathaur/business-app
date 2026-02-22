"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface TrackDetailsProps {
  configuration: Record<string, unknown>;
}

/**
 * TrackDetails - Track order / mobile number lookup
 * Simplified: mobile input that navigates to line details
 */
export default function TrackDetails({ configuration }: TrackDetailsProps) {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const handleTrack = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    // Navigate to line details with mobile (placeholder route)
    router.push(`/manage-users?track=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="pt-10 px-2.5">
      <div className="rounded-xl bg-white/10 px-4 py-3">
        <p className="text-xs text-white/70 mb-2">Track by Mobile or Order</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter mobile no. or order"
            className="flex-1 rounded-lg bg-white/20 px-3 py-2.5 text-sm text-white placeholder:text-white/50 border border-white/20 focus:border-white/40 outline-none"
          />
          <button
            type="button"
            onClick={handleTrack}
            className="px-4 py-2.5 rounded-lg bg-white text-primary font-medium text-sm hover:bg-white/90"
          >
            Check
          </button>
        </div>
      </div>
    </div>
  );
}
