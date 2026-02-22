"use client";

import { motion } from "framer-motion";
import Image from 'next/image';

/**
 * AnimatedLogo - Brand logo matching mock (stylized 'a' + airtel + BUSINESS CARE)
 * Variants: splash (white on red) | login (red on light grey)
 */
interface AnimatedLogoProps {
  size?: "sm" | "lg";
  /** splash = white/light on red | login = red on light */
  variant?: "splash" | "login";
  className?: string;
}

export default function AnimatedLogo({
  size = "sm",
  variant = "splash",
  className = "",
}: AnimatedLogoProps) {
  const isLarge = size === "lg";
  const isLogin = variant === "login";

  const textColor = isLogin ? "text-primary" : "text-white";
  const lineColor = isLogin ? "bg-primary/60" : "bg-white/40";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`flex flex-col items-center ${className}`}
    >
      {/* Stylized 'a' icon above airtel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`text-[2em] font-black italic leading-none ${textColor} ${isLarge ? "mb-1" : "mb-0.5"}`}
        style={{ fontFamily: "sans-serif" }}
      >

      </motion.div>
      <header
        className={`flex items-center justify-center`}>

        <Image
          src="/images/abc-logo.svg"
          alt="Business Logo"
          width={98}
          height={87}
        />
      </header>
    </motion.div>
  );
}
