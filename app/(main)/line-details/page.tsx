"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/layout/AppHeader";

/**
 * Line details - Placeholder for msisdn line details
 */
export default function LineDetailsPage() {
  const searchParams = useSearchParams();
  const msisdn = searchParams.get("msisdn") ?? "--";

  return (
    <>
      <AppHeader title="Line Details" backHref="/services" />
      <div className="flex-1 px-5 py-4">
        <p className="text-white/80 text-sm">Mobile: {msisdn}</p>
        <p className="text-white/60 text-xs mt-2">
          Line details page – to be implemented
        </p>
      </div>
    </>
  );
}
