"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "@/context/AccountContext";
import { useLocale } from "@/context/LocaleContext";
import { useAccountSearch } from "@/hooks/useAccountSearch";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Navigation } from "@/core/constants/navigation";
import { AccountItem } from "./AccountItem";
import AccountListSkeleton from "./AccountListSkeleton";

interface AccountListProps {
  variant?: "header" | "dropdown";
  onSelect?: (accountNo: string | string[]) => void;
  className?: string;
}

export function AccountList({
  variant = "header",
}: AccountListProps) {
  const {
    ecareaccounts,
    selectedIndex,
    select,
    selected,
    loadMore,
    isLoadingMore,
    hasMore,
  } = useAccount();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = useAccountSearch(ecareaccounts, query);
  const close = useCallback(() => setOpen(false), []);
  const containerRef = useOutsideClick<HTMLDivElement>(close);
  const { t } = useLocale();

  if (!ecareaccounts.length) {
    return <AccountListSkeleton />;
  }

  const handleSelect = (idx: number) => {
    select(idx);
    close();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="fixed w-full z-10"
      >
        <section className="flex items-center bg-slate-900 px-4 py-2.5 relative w-full rounded-b-lg">
          <div className="flex flex-1 flex-wrap gap-x-1 text-sm text-white min-w-0">
            <span className="font-medium truncate">
              {selected
                ? `${selected.accountName ?? ""} (${selected.accountNo})`
                : "Select account"}
            </span>
          </div>
          <Image
            src="/images/icons/chevron-down.svg"
            alt="Dropdown"
            width={12}
            height={12}
            className="ml-1 shrink-0"
          />
        </section>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[999] bg-black/58"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={close}
            />

            <motion.div
              ref={containerRef}
              className="fixed bottom-0 left-0 right-0 z-[9999] md:hidden"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 28,
              }}
            >
              <div className="bg-white shadow-lg rounded-t-[20px] max-h-[60vh] flex flex-col">
                <div className="flex justify-center pt-1 pb-1">
                  <div className="h-[5px] w-[50px] rounded-full bg-gray-300" />
                </div>

                <div className="flex items-center justify-between px-4 pt-2 pb-3">
                  <h4 className="text-sm font-semibold text-[#1F2436]">
                    {t("ENTERPRISE_USER_DASHBOARD.SELECT")}{" "}
                    {t("KAM_DASHBOARD.ACCOUNTS")}
                  </h4>
                  <motion.button
                    onClick={close}
                    aria-label="Close"
                    whileTap={{ scale: 0.85, rotate: 90 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Image
                      src="/images/icons/CloseIcon_black.svg"
                      alt="Close"
                      width={20}
                      height={20}
                    />
                  </motion.button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pb-3">
                  {filtered.map((acc, index) => {
                    const idx = ecareaccounts.findIndex(
                      (a) => a.accountNo === acc.accountNo
                    );
                    const isLast = index === filtered.length - 1;

                    return (
                      <React.Fragment key={`${acc.accountNo}-${index}`}>
                        <AccountItem
                          acc={acc}
                          active={idx === selectedIndex}
                          onClick={() => handleSelect(idx)}
                        />
                        {!isLast && (
                          <hr className="border-t border-gray-200 mx-4 mb-2" />
                        )}
                      </React.Fragment>
                    );
                  })}
                  {hasMore && loadMore && (
                    <div className="w-full px-4 pb-4">
                      <motion.button
                        onClick={loadMore}
                        disabled={isLoadingMore}
                        whileTap={isLoadingMore ? {} : { scale: 0.96 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-600 border border-gray-300 rounded-md"
                      >
                        {isLoadingMore ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4 text-gray-600"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            {t("ENTERPRISE_USER_DASHBOARD.LOADING")}...
                          </>
                        ) : (
                          "Load More"
                        )}
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
