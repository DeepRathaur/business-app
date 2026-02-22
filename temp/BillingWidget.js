import React, { useEffect, useState } from "react";
import { formatDate } from "@/utills";
import { useBillSummary } from "@/hooks/useBillSummary";
import { actionType } from "@/core/enum";
import { GetBillSummaryModel } from "@/shared/models";
import { useTranslate } from "@/hooks";
import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
  accountNo: string;
  currentPage: string;
  onClick: (actionType: string) => void;
  onEventHandler: (action: actionType, billSummary: GetBillSummaryModel) => void;
}

const BillingWidget: React.FC<Props> = ({
  accountNo,
  currentPage,
  onClick,
  onEventHandler,
}) => {
  const { billSummary, loading } = useBillSummary(accountNo);
  const t = useTranslate();

  const numberWithCommas = (x: number) => x.toLocaleString();

  if (loading)
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
          {/* Title */}
          <div className="h-4 w-40 bg-gray-200 rounded-md mb-3"></div>

          {/* Labels Row */}
          <div className="flex justify-between text-xs mb-1">
            <div className="h-3 w-32 bg-gray-200 rounded-md"></div>
            <div className="h-3 w-20 bg-gray-200 rounded-md"></div>
          </div>

          {/* Amount Row */}
          <div className="flex justify-between items-center mt-2 mb-3">
            <div className="flex gap-2 items-center">
              <div className="h-4 w-6 bg-gray-200 rounded-md"></div>
              <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
            </div>
            <div className="h-9 w-28 bg-gray-200 rounded-md"></div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded-md"></div>
            <div className="h-3 w-24 bg-gray-200 rounded-md"></div>
          </div>
        </motion.div>
      </motion.section>
    );

  return (
    <>

      <section className="mt-5 rounded-xl bg-white px-4 pb-3 pt-3 mx-2.5 shadow-lg">
        <div className="mb-1.5 flex items-center justify-between">
          <h2 className="text-sm font-semibold font-color-text">
            {t('BILLING_DETAILS.TOTAL_OUTSTANDING_AMOUNT')}
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
                {billSummary?.currency}
              </span>
              <span className="text-base font-bold font-color-text">
                {billSummary?.totalOutstandingAmount
                  ? numberWithCommas(billSummary.totalOutstandingAmount)
                  : "--"}
              </span>
            </div>

            <div className="mt-1 text-[11px]">
              <span className="mr-1 text-slate-500">Due Date</span><br />
              <span className="font-medium font-color-text">{billSummary?.dueDate ? formatDate(billSummary.dueDate) : "--"}</span>
            </div>
          </div>

          {billSummary && (
            <motion.button
              key="009io"
              type="button"
              whileTap={{ scale: 0.96 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              className="mt-6 whitespace-nowrap rounded-lg bg-slate-900 px-7 py-3.5 text-xs font-medium text-white"
              onClick={() => onEventHandler(actionType.PAY_TOTAL_OUTSTANDING, billSummary)}
            >
              {t('BUTTONS.PAY')}
            </motion.button>
          )}
        </div>
      </section>
    </>
  );
};

export default BillingWidget;