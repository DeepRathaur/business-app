"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AppHeader from "@/components/layout/AppHeader";
import CardContainer from "@/components/ui/CardContainer";
import PrimaryButton from "@/components/ui/PrimaryButton";

/**
 * Support - Customer support page
 * Contact options, FAQs
 */
export default function SupportPage() {
  const router = useRouter();
  return (
    <>
      <AppHeader title="Support" useRouterBack />
      <div className="flex-1 px-5 py-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <CardContainer>
            <h3 className="font-semibold text-white mb-2">Contact Us</h3>
            <p className="text-sm text-white/70 mb-4">
              Get help from our support team
            </p>
            <div className="space-y-3">
              <a
                href="tel:+254100"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
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
                <span className="text-white font-medium">Call 100</span>
              </a>
              <a
                href="mailto:support@airtel.co.ke"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-white font-medium">Email Support</span>
              </a>
            </div>
          </CardContainer>

          <div className="pt-4">
            <PrimaryButton
              variant="outline"
              fullWidth
              onClick={() => router.back()}
            >
              Back
            </PrimaryButton>
          </div>
        </motion.div>
      </div>
    </>
  );
}
