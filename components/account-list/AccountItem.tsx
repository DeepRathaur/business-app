"use client";

import React, { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { AccountDetailsModel } from "@/shared/models";

function clsx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface AccountItemProps {
  acc: AccountDetailsModel;
  active: boolean;
  onClick: () => void;
}

export const AccountItem = memo(function AccountItem({
  acc,
  active,
  onClick,
}: AccountItemProps) {
  return (
    <motion.div
      role="option"
      aria-selected={active}
      onClick={onClick}
      className="flex cursor-pointer items-start px-4 py-1"
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex-1">
        <p
          className={clsx(
            "flex items-center gap-2 text-sm font-extrabold text-neutral-900"
          )}
        >
          {acc.accountNo}
          {active && (
            <span
              className="rounded-[2px] bg-[#0AAF69] px-2 py-[2px] text-[10px] font-medium text-white"
            >
              selected
            </span>
          )}
        </p>
        <p
          className={clsx(
            "mt-0.5 text-xs",
            active ? "font-normal text-neutral-800" : "text-neutral-700"
          )}
        >
          {acc.accountName}
        </p>
      </div>
      <button
        type="button"
        aria-label="View billing details"
        className="text-lg text-slate-400"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <Image
          src="/images/icons/arrow_icon.svg"
          alt="Dropdown"
          width={20}
          height={20}
          className="cursor-pointer"
        />
      </button>
    </motion.div>
  );
});
