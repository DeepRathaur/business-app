"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ManageServiceSkeleton() {
  return (
    <motion.section
      className="mt-5 rounded-xl bg-white px-4 pb-3 pt-3 mx-2.5 shadow-lg"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <motion.div
        className="h-4 w-32 bg-gray-200 rounded mb-4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <div className="mt-1 flex justify-between gap-2">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="flex flex-1 flex-col items-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
          >
            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200" />
            <div className="h-3 w-12 bg-gray-200 rounded" />
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
