/**
 * Map service options to tab format for ServiceTabs
 */

import type { OptionsModel } from "@/shared/models/options.model";

const iconMap: Record<string, { icon: string; activeIcon: string }> = {
  MOBILE: { icon: "/images/icons/airtel_money.svg", activeIcon: "/images/icons/airtel_money.svg" },
  M2M: { icon: "/images/icons/M2M.svg", activeIcon: "/images/icons/M2M.svg" },
  FIXEDLINE: { icon: "/images/icons/billing.svg", activeIcon: "/images/icons/billing.svg" },
  FTTX: { icon: "/images/icons/buy-product.svg", activeIcon: "/images/icons/buy-product.svg" },
  FIBERCO: { icon: "/images/icons/ProductsServices.svg", activeIcon: "/images/icons/ProductsServices.svg" },
};

export interface ServiceTab {
  key: string;
  label: string;
  icon: string;
  activeIcon?: string;
}

export function mapServiceTypes(tabServiceCategory: OptionsModel[]): ServiceTab[] {
  return tabServiceCategory.map((t) => {
    const key = t.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const icons = iconMap[t.value] ?? iconMap[key] ?? iconMap.MOBILE;
    return {
      key: t.value,
      label: t.label,
      icon: t.icon ?? icons.icon,
      activeIcon: t.activeIcon ?? icons.activeIcon ?? icons.icon,
    };
  });
}
