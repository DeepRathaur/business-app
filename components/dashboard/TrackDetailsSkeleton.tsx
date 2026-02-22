"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TrackDetailsSkeleton() {
  return (
    <div className="pt-10 px-2.5">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="rounded-xl bg-white/10 px-4 py-3"
      >
        <div className="h-3 w-40 bg-white/20 rounded-md mb-2" />
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-white/20 rounded-lg" />
          <div className="w-20 h-10 bg-white/20 rounded-lg" />
        </div>
      </motion.div>
    </div>
  );
}
