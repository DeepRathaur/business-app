"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const quickLinks = [
  { label: "Pay Bill", href: "/paybill" },
  { label: "Support", href: "/support" },
  { label: "Manage Users", href: "/manage-users" },
];

/**
 * ManageService - Quick action links at bottom of dashboard
 */
export default function ManageService() {
  return (
    <div className="min-h-[26vh] px-2.5 py-6">
      <div className="flex flex-wrap gap-3">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <motion.button
              type="button"
              whileTap={{ scale: 0.96 }}
              className="px-5 py-3 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/15 transition-colors"
            >
              {link.label}
            </motion.button>
          </Link>
        ))}
      </div>
    </div>
  );
}
