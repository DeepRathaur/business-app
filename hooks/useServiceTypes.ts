"use client";

import { useMemo, useState, useCallback } from "react";
import { ServiceCategoryEnum } from "@/shared/enum";
import type { OptionsModel } from "@/shared/models/options.model";

const categoryToServiceTypes: Record<string, string[]> = {
  [ServiceCategoryEnum.MOBILE]: [ServiceCategoryEnum.MOBILE],
  [ServiceCategoryEnum.M2M]: [ServiceCategoryEnum.M2M],
  [ServiceCategoryEnum.FIXEDLINE]: [ServiceCategoryEnum.FIXEDLINE],
  [ServiceCategoryEnum.FTTX]: [ServiceCategoryEnum.FTTX],
  [ServiceCategoryEnum.FIBERCO]: [ServiceCategoryEnum.FIBERCO],
};

interface UseServiceTypesParams {
  productType?: unknown[];
}

export function useServiceTypes({ productType }: UseServiceTypesParams) {
  const [currentServiceType, setCurrentServiceType] = useState<string | null>(
    null
  );

  const serviceTypeList = useMemo(() => {
    const arr = productType as { name?: string }[] | undefined;
    if (Array.isArray(arr) && arr.length > 0) {
      return arr.map((p) => p.name ?? "").filter(Boolean);
    }
    return Object.values(ServiceCategoryEnum);
  }, [productType]);

  const getAllServiceTypes = useCallback((): OptionsModel[] => {
    return serviceTypeList.map((s) => ({
      label: s.replace(/_/g, " "),
      value: s,
    }));
  }, [serviceTypeList]);

  const getServiceTypeListByCategory = useCallback(
    (category: string): string[] => {
      return (
        categoryToServiceTypes[category] ?? [category]
      );
    },
    []
  );

  return {
    getAllServiceTypes,
    getServiceTypeListByCategory,
    serviceTypeList,
    currentServiceType,
    setCurrentServiceType,
  };
}
