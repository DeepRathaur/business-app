"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { LineDetailsModel } from "@/shared/models";
import { useInterModuleNavigationService } from "@/hooks/useInterModuleNavigation";

interface ServiceListProps {
  items: LineDetailsModel[];
}

export default function ServiceList({ items }: ServiceListProps) {
  const { toLineDetails } = useInterModuleNavigation();

  const handleMobileCheck = (mobile: string) => {
    toLineDetails(mobile);
  };

  return (
    <section className="w-full pt-1 pb-3">
      <div className="w-full space-y-2">
        {items.map((line, i) => (
          <motion.div
            key={`${line.msisdn ?? i}-${i}`}
            role="option"
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="
              w-full bg-white
              flex justify-between items-center
              px-4 py-3 shadow-sm border rounded-lg
              text-neutral-900
            "
          >
            <div className="flex-1">
              <p className="text-sm font-extrabold">
                {line.msisdn ?? "--"}
              </p>
              <p
                className={`mt-0.5 text-xs ${
                  line.status?.toLowerCase() === "active"
                    ? "text-green-600"
                    : line.status?.toLowerCase() === "inactive"
                      ? "text-red-600"
                      : "text-neutral-600"
                }`}
              >
                {line.status ?? "--"}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">
                {line.lineType ?? "--"}
              </p>
            </div>

            <button
              type="button"
              aria-label="View details"
              className="text-lg text-slate-400 p-1"
              onClick={() => handleMobileCheck(line.msisdn ?? "")}
            >
              <Image
                src="/images/icons/arrow_icon.svg"
                alt="View"
                width={20}
                height={20}
                className="cursor-pointer"
              />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
