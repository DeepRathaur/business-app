"use client";

import React from "react";
import { motion } from "framer-motion";

export default function BannerSliderSkeleton() {
  return (
    <div className="mt-4 mx-2.5 rounded-xl overflow-hidden">
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="aspect-[2.5/1] w-full bg-white/10 rounded-xl"
      />
    </div>
  );
}
