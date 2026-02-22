"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAccount } from "@/context/AccountContext";

/**
 * AccountList - Account selector dropdown
 * Shows selected account; tap to expand and pick another
 */
export default function AccountList() {
  const { ecareaccounts, selected, select } = useAccount();
  const [expanded, setExpanded] = useState(false);

  if (ecareaccounts.length === 0) {
    return (
      <div className="px-5 py-3 bg-white/10 rounded-xl mx-2.5 mb-2">
        <p className="text-sm text-white/80">No account selected</p>
      </div>
    );
  }

  return (
    <div className="px-2.5 mb-2">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-left"
      >
        <div>
          <p className="text-xs text-white/70">Account</p>
          <p className="text-sm font-semibold text-white truncate">
            {selected?.accountName ?? selected?.accountNo ?? "--"}
          </p>
        </div>
        <Image
          src="/images/icons/chevron-down.svg"
          alt=""
          width={20}
          height={20}
          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="mt-1 rounded-xl bg-white/10 overflow-hidden">
          {ecareaccounts.map((acc, i) => (
            <button
              key={acc.accountNo}
              type="button"
              onClick={() => {
                select(i);
                setExpanded(false);
              }}
              className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                selected?.accountNo === acc.accountNo
                  ? "bg-white/20 text-white font-medium"
                  : "text-white/90 hover:bg-white/10"
              }`}
            >
              {acc.accountName ?? acc.accountNo}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
