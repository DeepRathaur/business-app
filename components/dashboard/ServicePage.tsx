"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const defaultServices = [
  { icon: "/images/icons/airtel_money.svg", label: "Mobile", path: "/services?type=MOBILE" },
  { icon: "/images/icons/M2M.svg", label: "M2M", path: "/services?type=M2M" },
  { icon: "/images/icons/billing.svg", label: "Fixedline", path: "/services?type=FIXEDLINE" },
  { icon: "/images/icons/buy-product.svg", label: "FTTX", path: "/services?type=FTTX" },
  { icon: "/images/icons/ProductsServices.svg", label: "FiberCo", path: "/services?type=FIBERCO" },
];

interface ServicePageProps {
  configuration?: Record<string, unknown>;
}

/**
 * ServicePage - Grid of service quick links
 * Uses config layout if available; otherwise default services
 */
export default function ServicePage({ configuration }: ServicePageProps) {
  const services = defaultServices;

  return (
    <div className="px-2.5 py-4">
      <h3 className="text-sm font-semibold text-white mb-3">Manage Services</h3>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-3 gap-3"
      >
        {services.map((s, i) => (
          <Link
            key={s.label}
            href={s.path}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/10 hover:bg-white/15 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-2">
              <Image
                src={s.icon}
                alt=""
                width={24}
                height={24}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <span className="text-xs font-medium text-white">{s.label}</span>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
