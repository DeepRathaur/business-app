"use client";

interface AppBootstrapProps {
  children: React.ReactNode;
}

/**
 * AppBootstrap - Renders children immediately.
 * Config and locale APIs run in background; UI uses defaults until they resolve.
 */
export function AppBootstrap({ children }: AppBootstrapProps) {
  return <>{children}</>;
}
