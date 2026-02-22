"use client";

import React from "react";
import AppHeader from "@/components/layout/AppHeader";

interface BackButtonAuthProps {
  title: string;
  onBack?: () => void;
}

/**
 * BackButtonAuth - Header with back button (uses router.back or custom onBack)
 */
export default function BackButtonAuth({ title, onBack }: BackButtonAuthProps) {
  return (
    <AppHeader
      title={title}
      useRouterBack={true}
      onBack={onBack}
    />
  );
}
