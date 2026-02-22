"use client";

import { useInterModuleNavigationService } from "@/hooks";
import { LineDetailsModel } from "@/shared/models";
import { motion } from "framer-motion";
import Image from "next/image";

type LineItem = {
  msisdn: string;
  status: string;
  plan: string;
};

type ServiceListProps = {
  items: LineDetailsModel[];
};

export default function ServiceList({ items }: ServiceListProps) {
  const { toLineDetailes, toOrderDetails } = useInterModuleNavigationService();
  
  const handleMobileCheck = (mobile: string) => {
    toLineDetailes(mobile)
  };

  return (
    <section className="w-full pt-1 pb-3">
      <div className="w-full space-y-2">
        {items.map((line, i) => (
          <motion.div
            key={`${line.msisdn}-${i}`}
            role="option"
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="
              w-full bg-white 
              flex justify-between items-center 
              px-4 py-3  shadow-sm border
            "
          >
            <div className="flex-1">
              <p className="text-sm font-extrabold font-color-text">
                {line.msisdn}
              </p>

              <p
                className={`mt-0.5 text-xs ${line.status?.toLowerCase() === 'active'
                    ? 'text-green-600'
                    : line.status?.toLowerCase() === 'inactive'
                      ? 'text-red-600'
                      : 'font-color-text'
                  }`}
              >
                {line.status}
              </p>

              <p className="mt-0.5 text-xs font-color-text">{line.lineType}</p>
            </div>

            <button
              type="button"
              aria-label="View details"
              className="text-lg text-slate-400"
            >
              <Image
                src="/images/icons/arrow_icon.svg"
                alt="Dropdown"
                width={20}
                height={20}
                className="cursor-pointer"
                onClick={() => handleMobileCheck(line.msisdn)}
              />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}