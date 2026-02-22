"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

/**
 * PageTransitionWrapper - Smooth page transitions with Framer Motion
 * Used for route changes inside the app
 */
interface PageTransitionWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function PageTransitionWrapper({
  children,
  className = "",
}: PageTransitionWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
