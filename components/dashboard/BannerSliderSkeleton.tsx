"use client";

import React from "react";
import { motion } from "framer-motion";

export default function BannerSliderSkeleton() {
  return (
    <section className="mt-3 mx-4">
      <div className="relative overflow-hidden rounded-xl bg-white shadow-sm">
        <motion.div
          className="h-[155px] w-full bg-gray-200"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-gray-300"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
