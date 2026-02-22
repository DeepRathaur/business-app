"use client";

import { useFetchPermission } from "@/features/auth/fetchPermission";

function FetchPermissionSkeleton() {
  return (
    <div className="h-full min-h-[100dvh] flex flex-col bg-neutral-100 p-6">
      <div className="space-y-6 max-w-md mx-auto w-full">
        <div className="h-8 w-48 rounded shimmer bg-neutral-200" />
        <div className="space-y-4">
          <div className="h-20 w-full rounded-xl shimmer bg-neutral-200" />
          <div className="h-20 w-full rounded-xl shimmer bg-neutral-200" />
          <div className="h-20 w-full rounded-xl shimmer bg-neutral-200" />
        </div>
        <div className="space-y-3 pt-4">
          <div className="h-4 w-full rounded shimmer bg-neutral-200" />
          <div className="h-4 w-5/6 rounded shimmer bg-neutral-200" />
          <div className="h-4 w-4/5 rounded shimmer bg-neutral-200" />
          <div className="h-4 w-3/4 rounded shimmer bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}

/**
 * Fetch Permission Page - Runs after OTP verify success
 * Shows skeleton until getUserDetails + getUMSPermission resolve.
 * Navigates to dashboard when all succeed; login on failure.
 */
export default function FetchPermissionPage() {
  const { loading } = useFetchPermission();

  if (loading) {
    return <FetchPermissionSkeleton />;
  }

  return null;
}
