"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { accountService } from "@/core/services/account.service";
import { useServiceTypes } from "@/hooks/useServiceTypes";
import { useInterModuleNavigation } from "@/hooks/useInterModuleNavigation";
import { mapServiceTypes } from "@/lib/utils/service-mapper";
import { getServiceCategoryTabs } from "@/lib/utils/service-tabs";
import { Navigation } from "@/core/constants/navigation";

interface ServicePageProps {
  configuration?: Record<string, unknown>;
}

export default function ServicePage({ configuration }: ServicePageProps) {
  const router = useRouter();
  const [serviceTypesArr, setServiceTypes] = useState<{ label: string; value: string }[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const productType = (configuration?.ProductType ?? []) as unknown[];
  const role = accountService.getEnterPriseRole();
  const { toService } = useInterModuleNavigation();

  const {
    getAllServiceTypes,
    getServiceTypeListByCategory,
    setCurrentServiceType,
  } = useServiceTypes({ productType });

  useEffect(() => {
    const types = getAllServiceTypes();
    setServiceTypes(types);
  }, [getAllServiceTypes]);

  const tabServiceCategory = getServiceCategoryTabs(
    configuration,
    role ?? undefined,
    serviceTypesArr
  );
  const services = mapServiceTypes(tabServiceCategory);

  const pageSize = 4;
  const totalPages = Math.ceil(services.length / pageSize);
  const [currentPage, setCurrentPage] = useState(0);

  const pagedServices = services.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  const goToPage = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offsetX = info.offset.x;
    const velocityX = info.velocity.x;
    const swipeThreshold = 50;
    const velocityThreshold = 300;

    if (offsetX < -swipeThreshold || velocityX < -velocityThreshold) {
      goToPage(currentPage + 1);
    }
    if (offsetX > swipeThreshold || velocityX > velocityThreshold) {
      goToPage(currentPage - 1);
    }
  };

  const onNavigate = () => {
    router.push(Navigation.SERVICES);
  };

  const handleCategoryClick = (key: string) => {
    setCurrentCategory(key);
    setCurrentServiceType(key);
    toService(key);
  };

  return (
    <section className="mt-5 rounded-xl bg-white px-4 pb-3 pt-3 mx-2.5 shadow-lg">
      <div className="mb-1.5 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">Services</h2>
        <motion.button
          type="button"
          aria-label="View all services"
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="text-lg text-slate-400"
          onClick={onNavigate}
        >
          <Image
            src="/images/icons/arrow_icon.svg"
            alt="Dropdown"
            width={20}
            height={20}
          />
        </motion.button>
      </div>

      <div className="pt-2 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPage}
            className="flex justify-between gap-2"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {pagedServices.map((s) => (
              <motion.button
                key={s.label}
                type="button"
                whileTap={{ scale: 0.94 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex flex-1 flex-col items-center"
                onClick={() => handleCategoryClick(s.key)}
              >
                <div
                  className={`mb-1 flex h-10 w-10 items-center justify-center rounded-lg ${
                    s.key === currentCategory ? "bg-red-600" : "bg-[#F0F6FF]"
                  }`}
                >
                  <Image
                    src={s.key === currentCategory && s.activeIcon ? s.activeIcon : s.icon}
                    alt={s.label}
                    width={24}
                    height={24}
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <span className="text-xs text-neutral-900">{s.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
