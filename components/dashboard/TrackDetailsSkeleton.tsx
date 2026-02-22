"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TrackDetailsSkeleton() {
  return (
    <motion.section
      className="px-2 pt-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <motion.div
        className="flex items-center rounded-md bg-white px-3 py-2 shadow-sm border border-[#D6D6D6]"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        <div className="w-4 h-4 rounded bg-gray-300 mr-2" />
        <div className="flex-1 h-4 bg-gray-200 rounded" />
      </motion.div>
    </motion.section>
  );
}
