"use client";

import { useEffect, useState } from "react";
import { loadBillSummary } from "@/core/services/master.service";
import type { GetBillSummaryModel } from "@/shared/models";

/** Merged bill summary model for display */
export interface BillSummaryDisplay extends GetBillSummaryModel {
  totalOutstandingAmount?: number;
  totalOverdueAmount?: number;
  dueDate?: string;
  invoiceNo?: string;
  currency?: string;
}

export function useBillSummary(accountNo: string) {
  const [billSummary, setBillSummary] = useState<BillSummaryDisplay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accountNo) {
      setLoading(false);
      setBillSummary(null);
      return;
    }

    let cancelled = false;

    const fetchBillSummary = async () => {
      setLoading(true);
      try {
        const res = await loadBillSummary({
          accountNo,
          currentPage: "1",
        });
        if (cancelled) return;
        if (res?.statusCode === "SUCCESS" && res?.result) {
          setBillSummary({
            ...res.result,
            totalOutstandingAmount: (res.result as Record<string, unknown>).totalOutstandingAmount as number | undefined,
            totalOverdueAmount: (res.result as Record<string, unknown>).totalOverdueAmount as number | undefined,
            dueDate: (res.result as Record<string, unknown>).dueDate as string | undefined,
            invoiceNo: (res.result as Record<string, unknown>).invoiceNo as string | undefined,
            currency: (res.result as Record<string, unknown>).currency as string | undefined,
          });
        } else {
          setBillSummary(null);
        }
      } catch {
        if (!cancelled) setBillSummary(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBillSummary();
    return () => {
      cancelled = true;
    };
  }, [accountNo]);

  return { billSummary, loading };
}
