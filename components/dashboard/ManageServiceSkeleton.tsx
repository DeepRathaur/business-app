"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ManageServiceSkeleton() {
  return (
    <div className="px-2.5 py-4">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="grid grid-cols-3 gap-3"
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-white/10 flex flex-col items-center justify-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-white/20" />
            <div className="h-3 w-12 bg-white/20 rounded" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
