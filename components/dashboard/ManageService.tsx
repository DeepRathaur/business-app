"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const manageItems = [
  { label: "Self Services", icon: "/images/icons/self_servi.svg" },
  { label: "Service Requests", icon: "/images/icons/service_request.svg" },
];

export default function ManageService() {
  return (
    <section className="mt-5 mx-2.5 rounded-xl bg-white px-4 pb-4 pt-3 shadow-sm">
      <h2 className="text-sm font-semibold text-neutral-900">Manage</h2>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {manageItems.map((item) => (
          <motion.button
            key={item.label}
            type="button"
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="
              flex items-center gap-1
              flex-1 min-w-[120px] max-w-[170px]
              h-[44px]
              px-[8px] py-[13px]
              rounded-[8px]
              border border-[#D6D6D6]
              bg-white
              text-neutral-900
            "
          >
            <div className="flex items-center h-[22px] w-[22px] shrink-0">
              <Image
                src={item.icon}
                alt={item.label}
                width={16}
                height={16}
                className="object-contain"
              />
            </div>
            <span className="text-xs font-normal">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
