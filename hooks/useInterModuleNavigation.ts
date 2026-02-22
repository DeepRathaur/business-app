"use client";

import { useRouter } from "next/navigation";
import { Navigation } from "@/core/constants/navigation";

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

  const toService = (serviceType: string) => {
    router.push(`${Navigation.SERVICES}?type=${encodeURIComponent(serviceType)}`);
  };

  return {
    toLineDetails,
    toOrderDetails,
    toFormRenderer,
    toService,
  };
}
