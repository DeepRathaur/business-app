"use client";

import { useConfig } from "@/context/ConfigContext";

interface AppBootstrapProps {
  children: React.ReactNode;
}

function AppSkeleton() {
  return (
    <div className="h-full min-h-[100dvh] flex flex-col items-center justify-center bg-neutral-100 p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="h-12 w-32 mx-auto rounded-md shimmer bg-neutral-200" />
        <div className="space-y-3">
          <div className="h-10 w-full rounded-md shimmer bg-neutral-200" />
          <div className="h-10 w-full rounded-md shimmer bg-neutral-200" />
          <div className="h-10 w-3/4 rounded-md shimmer bg-neutral-200" />
        </div>
        <div className="space-y-2 pt-4">
          <div className="h-4 w-full rounded shimmer bg-neutral-200" />
          <div className="h-4 w-5/6 rounded shimmer bg-neutral-200" />
          <div className="h-4 w-4/5 rounded shimmer bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}

/**
 * AppBootstrap - Shows skeleton until config API resolves
 * Flow: Config API first → then Locale (static JSON until API resolves, then dynamic)
 * Dashboard/fetch-permission show their own skeletons when needed
 */
export function AppBootstrap({ children }: AppBootstrapProps) {
  const config = useConfig();

  if (config.loading) {
    return <AppSkeleton />;
  }

  return <>{children}</>;
}
