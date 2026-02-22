"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { BannerModel } from "@/shared/models";

interface BannerSliderProps {
  slides: BannerModel[];
  onClick?: (slide: BannerModel) => void;
}

export default function BannerSlider({ slides, onClick }: BannerSliderProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(
      () => setCurrent((c) => (c + 1) % slides.length),
      4000
    );
    return () => clearInterval(id);
  }, [slides.length]);

  if (!slides?.length) return null;

  return (
    <div className="mt-4 mx-2.5 rounded-xl overflow-hidden bg-white/5">
      <div className="relative aspect-[2.5/1] w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <button
              type="button"
              onClick={() => slides[current] && onClick?.(slides[current])}
              className="block w-full h-full relative"
            >
              {slides[current]?.imageUri ? (
                <Image
                  src={slides[current].imageUri}
                  alt={slides[current].name ?? "Banner"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 430px) 100vw, 430px"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-primary/40 to-primary/20 flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {slides[current]?.name ?? "Banner"}
                  </span>
                </div>
              )}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
      {slides.length > 1 && (
        <div className="flex justify-center gap-1.5 py-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === current ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
