"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceCategoryEnum } from "@/shared/enum/service-category.enum";

type Tab = {
  key: ServiceCategoryEnum;
  label: string;
  icon: string;
  activeIcon?:string;
};

type Props = {
  tabs: Tab[];
  activeTab: string|null;
  setActiveTab: (key: ServiceCategoryEnum) => void;
};

export default function ServiceTabs({ tabs, activeTab, setActiveTab }: Props) {
  const [showAll, setShowAll] = useState(false);

  const hasMoreThanFour = tabs.length > 4;
  const visibleTabs =
    !hasMoreThanFour || showAll ? tabs : tabs.slice(0, 4);

  const toggleShowAll = () => setShowAll((prev) => !prev);

  return (
    <>
      <motion.div layout className="pt-4 w-full bg-white pb-6 relative">
        {/* Tabs container */}
        <motion.div
          layout
          className="mt-1 px-2 grid grid-cols-4 gap-2 place-items-center"
        >
          <AnimatePresence initial={false}>
            {visibleTabs.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <motion.button
                  key={tab.key}
                  layout
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                  onClick={() => setActiveTab(tab.key)}
                  className={`
              flex flex-col items-center gap-2
              w-[70px] h-[58px]
              px-[17px] py-[10px]
              rounded-xl border
              ${isActive
                      ? "bg-red-600 border-red-600 text-white shadow-md"
                      : "bg-white border-gray-300 text-slate-700"
                    }
            `}
                >
                  {/* Icon */}
                  <div className="flex h-5 w-5 items-center justify-center">
                    <Image
                      src={ `${isActive
                        ? tab.activeIcon
                        : tab.icon
                      }`}
                      alt={tab.label}
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                  </div>

                  {/* Label below icon */}
                  <span className="text-[11px] font-medium whitespace-nowrap">
                    {tab.label}
                  </span>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* VIEW ALL / HIDE pill overlapped on bottom */}
        {hasMoreThanFour && (
          <div className="absolute left-1/2  -translate-x-1/2 translate-y-1/3">
            <div className="relative">
              {/* White Union pill background */}
              <Image
                src="/images/icons/Union.svg"
                alt="union"
                width={190}
                height={37}
                className="block"
              />

              {/* Red pill with white text (centered on Union) */}
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={toggleShowAll}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div
                  className="mb-1
              bg-[#FFF1F1] text-red-500
              px-4 py-1
              rounded-[10.5px]
              text-xs font-semibold
              flex items-center gap-1
            "
                >
                  {showAll ? "Hide" : "View All"}
                  <motion.span
                    initial={false}
                    animate={{ rotate: showAll ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="text-[9px]"
                  >
                    <Image
                      src="/images/icons/red-down-arrow.svg"
                      alt="union"
                      width={10}
                      height={10}
                      className="block"
                    />
                  </motion.span>
                </div>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}