"use client";

import { useMemo } from "react";
import type { AccountDetailsModel } from "@/shared/models";

export function useAccountSearch(
  accounts: AccountDetailsModel[],
  query: string
): AccountDetailsModel[] {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return accounts;
    return accounts.filter(
      (a) =>
        a.accountNo?.toLowerCase().includes(q) ||
        a.accountName?.toLowerCase().includes(q)
    );
  }, [accounts, query]);
}
