"use client";

import { memo } from "react";
import { cn } from "@/lib/utils/cn";

interface FieldSkeletonProps {
  className?: string;
  hasLabel?: boolean;
}

function FieldSkeletonComponent({ className, hasLabel = true }: FieldSkeletonProps) {
  return (
    <div className={cn("w-full animate-pulse", className)}>
      {hasLabel && (
        <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
      )}
      <div className="h-10 w-full bg-gray-200 rounded-md" />
    </div>
  );
}

export const FieldSkeleton = memo(FieldSkeletonComponent);
