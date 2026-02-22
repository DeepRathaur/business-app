"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";
import { useBillSummary } from "@/hooks/useBillSummary";
import { actionType } from "@/core/constants/action-type";
import { formatDate } from "@/lib/utils/formatDate";
import type { BillSummaryDisplay } from "@/hooks/useBillSummary";

const numberWithCommas = (x: number) => x.toLocaleString();

interface BillingWidgetProps {
  accountNo: string;
  currentPage?: string;
  onClick?: (actionType: string) => void;
  onEventHandler: (
    action: (typeof actionType)[keyof typeof actionType],
    billSummary: BillSummaryDisplay
  ) => void;
}

export default function BillingWidget({
  accountNo,
  onEventHandler,
}: BillingWidgetProps) {
  const { billSummary, loading } = useBillSummary(accountNo);
  const { t } = useLocale();

  if (loading) {
    return (
      <motion.section
        className="mt-5 rounded-xl bg-white px-4 pb-3 pt-3 mx-2.5 shadow-lg"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <div className="h-4 w-40 bg-gray-200 rounded-md mb-3" />
          <div className="flex justify-between text-xs mb-1">
            <div className="h-3 w-32 bg-gray-200 rounded-md" />
            <div className="h-3 w-20 bg-gray-200 rounded-md" />
          </div>
          <div className="flex justify-between items-center mt-2 mb-3">
            <div className="flex gap-2 items-center">
              <div className="h-4 w-6 bg-gray-200 rounded-md" />
              <div className="h-4 w-20 bg-gray-200 rounded-md" />
            </div>
            <div className="h-9 w-28 bg-gray-200 rounded-md" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded-md" />
            <div className="h-3 w-24 bg-gray-200 rounded-md" />
          </div>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <section className="mt-5 rounded-xl bg-white px-4 pb-3 pt-3 mx-2.5 shadow-lg text-neutral-900">
      <div className="mb-1.5 flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          {t("BILLING_DETAILS.TOTAL_OUTSTANDING_AMOUNT")}
        </h2>
        {billSummary && (
          <button
            type="button"
            aria-label="View billing details"
            className="text-lg text-slate-400"
            onClick={() => onEventHandler(actionType.BILLING_PAGE, billSummary)}
          >
            <Image
              src="/images/icons/arrow_icon.svg"
              alt="Dropdown"
              width={20}
              height={20}
            />
          </button>
        )}
      </div>

      <div className="mt-1 flex items-center justify-between gap-3">
        <div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-base font-semibold text-red-500">
              {billSummary?.currency ?? "--"}
            </span>
            <span className="text-base font-bold">
              {billSummary?.totalOutstandingAmount != null
                ? numberWithCommas(billSummary.totalOutstandingAmount)
                : "--"}
            </span>
          </div>
          <div className="mt-1 text-[11px]">
            <span className="mr-1 text-slate-500">Due Date</span>
            <br />
            <span className="font-medium">
              {billSummary?.dueDate ? formatDate(billSummary.dueDate) : "--"}
            </span>
          </div>
        </div>

        {billSummary && (
          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mt-6 whitespace-nowrap rounded-lg bg-slate-900 px-7 py-3.5 text-xs font-medium text-white"
            onClick={() =>
              onEventHandler(actionType.PAY_TOTAL_OUTSTANDING, billSummary)
            }
          >
            {t("BUTTONS.PAY")}
          </motion.button>
        )}
      </div>
    </section>
  );
}
