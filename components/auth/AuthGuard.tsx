"use client";

import React from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard - Wraps protected routes. Redirects to /login if not authenticated.
 * Shows loading skeleton while checking auth state.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isChecking } = useAuthGuard();

  if (isChecking) {
    return (
      <div className="h-full min-h-[100dvh] flex flex-col items-center justify-center bg-primary p-6">
        <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        <p className="mt-4 text-sm text-white/80">Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
