/**
 * Service category tabs - From config or default
 */

import { ServiceCategoryEnum } from "@/shared/enum";
import type { OptionsModel } from "@/shared/models/options.model";
const defaultServiceTypes: OptionsModel[] = [
  { label: "Mobile", value: ServiceCategoryEnum.MOBILE },
  { label: "M2M", value: ServiceCategoryEnum.M2M },
  { label: "Fixedline", value: ServiceCategoryEnum.FIXEDLINE },
  { label: "FTTX", value: ServiceCategoryEnum.FTTX },
  { label: "FiberCo", value: ServiceCategoryEnum.FIBERCO },
];

export function getServiceCategoryTabs(
  configuration: Record<string, unknown> | undefined,
  role: string | undefined,
  serviceTypesArr: OptionsModel[]
): OptionsModel[] {
  if (serviceTypesArr?.length > 0) {
    return serviceTypesArr;
  }
  const productType = configuration?.ProductType as { name?: string; label?: string }[] | undefined;
  if (Array.isArray(productType) && productType.length > 0) {
    return productType.map((p) => ({
      label: p.label ?? p.name ?? "",
      value: p.name ?? p.label ?? "",
    }));
  }
  return defaultServiceTypes;
}
