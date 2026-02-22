"use client";

import { useRouter } from "next/navigation";

/**
 * Inter-module navigation - Line details, order details, etc.
 */
export function useInterModuleNavigationService() {
  const router = useRouter();

  const toLineDetails = (msisdn: string) => {
    router.push(`/line-details?msisdn=${encodeURIComponent(msisdn)}`);
  };

  const toOrderDetails = (_order: unknown) => {
    router.push("/manage-users");
  };

  const toFormRenderer = (_formId?: string) => {
    router.push("/manage-users");
  };

  return {
    toLineDetails,
    toOrderDetails,
    toFormRenderer,
  };
}
