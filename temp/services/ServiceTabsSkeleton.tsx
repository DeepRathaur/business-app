"use client";

import { motion } from "framer-motion";

export default function ServiceTabsSkeleton() {
  return (
    <div className="flex overflow-x-auto gap-3 pb-2">
      {[1,2,3,4].map((x) => (
        <motion.div
          key={x}
          className="h-9 w-24 bg-gray-200 rounded-full"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      ))}
    </div>
  );
}
