"use client";

import React from "react";
import { motion } from "framer-motion";

export default function AccountListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <section className="flex items-center bg-slate-900 px-4 py-2.5 w-full gap-3">
      <span className="text-white text-sm">Loading accounts</span>
      <div className="flex items-center space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-white/30"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </section>
  );
}
