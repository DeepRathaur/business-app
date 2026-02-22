"use client";

import { motion } from "framer-motion";

export default function ServiceListSkeleton() {
  return (
    <div className="mt-4 space-y-3">
      {[1,2,3,4,5].map((x) => (
        <motion.div
          key={x}
          className="border rounded-md bg-white px-4 py-3 shadow-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        >
          <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-20 bg-gray-200 rounded mb-1" />
          <div className="h-3 w-28 bg-gray-200 rounded" />
        </motion.div>
      ))}
    </div>
  );
}