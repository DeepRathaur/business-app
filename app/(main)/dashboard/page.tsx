"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AppHeader from "@/components/layout/AppHeader";
import CardContainer from "@/components/ui/CardContainer";
import PrimaryButton from "@/components/ui/PrimaryButton";

/**
 * Dashboard - Main post-login home screen
 * Summary cards, quick actions
 */
export default function DashboardPage() {
  return (
    <>
      <AppHeader title="Dashboard" />
      <div className="flex-1 px-5 py-4 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h2 className="text-xl font-bold text-white">
            Welcome to Airtel Business
          </h2>
          <p className="text-sm text-white/70 mt-1">
            Manage your account and users
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid gap-4"
        >
          <CardContainer>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Active Lines</p>
                <p className="text-2xl font-bold text-white mt-1">12</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
            </div>
          </CardContainer>

          <CardContainer>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Data Balance</p>
                <p className="text-2xl font-bold text-white mt-1">24.5 GB</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </CardContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-3 pt-2"
        >
          <Link href="/manage-users">
            <PrimaryButton fullWidth variant="secondary">
              Manage Users
            </PrimaryButton>
          </Link>
          <Link href="/paybill">
            <PrimaryButton fullWidth variant="outline">
              Pay Bill
            </PrimaryButton>
          </Link>
          <Link href="/support">
            <PrimaryButton fullWidth variant="ghost">
              Support
            </PrimaryButton>
          </Link>
        </motion.div>
      </div>
    </>
  );
}
