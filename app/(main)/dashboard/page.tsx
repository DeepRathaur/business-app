"use client";

import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AppHeader from "@/components/layout/AppHeader";
import { useConfig } from "@/context/ConfigContext";
import { useAccount } from "@/context/AccountContext";
import { accountService } from "@/core/services/account.service";
import { loadAccountDetails, getBannerConfiguration } from "@/core/services/master.service";
import { Navigation } from "@/core/constants/navigation";
import { actionType } from "@/core/constants/action-type";
import { ResponseCodeEnum, PaymentModeEnum, TransactionTypeEnum } from "@/shared/enum";
import type { TransactionInfoModel } from "@/shared/models";
import type { BillSummaryDisplay } from "@/hooks/useBillSummary";
import type { BannerModel } from "@/shared/models";
import AccountList from "@/components/dashboard/AccountList";
import BillingWidget from "@/components/dashboard/BillingWidget";
import BannerSlider from "@/components/dashboard/BannerSlider";
import BannerSliderSkeleton from "@/components/dashboard/BannerSliderSkeleton";
import TrackDetails from "@/components/dashboard/TrackDetails";
import TrackDetailsSkeleton from "@/components/dashboard/TrackDetailsSkeleton";
import ServicePage from "@/components/dashboard/ServicePage";
import ManageServiceSkeleton from "@/components/dashboard/ManageServiceSkeleton";
import ManageService from "@/components/dashboard/ManageService";

export default function DashboardPage() {
  const router = useRouter();
  const { config, loading: configLoading } = useConfig();
  const { selected, setAccounts } = useAccount();
  const configuration = (config as { result?: { public?: Record<string, unknown> } })?.result?.public;
  const [slides, setSlides] = useState<BannerModel[]>([]);
  const [bannerLoading, setBannerLoading] = useState(true);

  useEffect(() => {
    const loadAccounts = async () => {
      const email = accountService.getAuuid();
      if (!email) return;
      try {
        const res = await loadAccountDetails({ email });
        if (res?.statusCode === ResponseCodeEnum.SUCCESS && res?.result) {
          const accounts =
            (res.result.ecareaccounts as { accountNo: string; accountName?: string }[]) ??
            (res.result.accounts as { accountNo: string; accountName?: string }[]) ??
            [];
          setAccounts(accounts);
        }
      } catch {
        // Fallback: use mock account for demo
        setAccounts([
          {
            accountNo: "ACC001",
            accountName: "Demo Account",
            contactPersonMsisdn: "+254700000000",
          },
        ]);
      }
    };
    loadAccounts();
  }, [setAccounts]);

  useEffect(() => {
    const loadBanners = async () => {
      setBannerLoading(true);
      try {
        const res = await getBannerConfiguration();
        if (res?.statusCode === ResponseCodeEnum.SUCCESS && res?.result?.length) {
          setSlides(res.result);
        }
      } catch {
        setSlides([]);
      } finally {
        setBannerLoading(false);
      }
    };
    loadBanners();
  }, []);

  const requestForPayNow = (payload: BillSummaryDisplay) => {
    if (selected && configuration) {
      const currencyConf = (configuration.replaceCurrencyConf ?? null) as {
        currency?: string;
        replaceWith?: string;
      } | null;
      let currency = payload.currency ?? "NGN";
      if (currencyConf && payload.currency === currencyConf.currency) {
        currency = currencyConf.replaceWith ?? currency;
      }
      const input: TransactionInfoModel = {
        accountNo: payload.accountNo,
        invoiceNo: payload.invoiceNo,
        outstandingAmount: payload.totalOutstandingAmount,
        overdueAmount: payload.totalOverdueAmount,
        dueDate: payload.dueDate,
        clientName: selected.accountName,
        currency,
        amount: String(payload.totalOutstandingAmount ?? 0),
        mode: PaymentModeEnum.INVOICE,
        mobileNumber: selected.contactPersonMsisdn,
        serviceName: TransactionTypeEnum.POSTPAID_BILL,
        transactionType: TransactionTypeEnum.POSTPAID_BILL,
        countryCode: (configuration.OPCO_CONFIG as { COUNTRY_CODE?: string })?.COUNTRY_CODE,
      };
      accountService.setTxnInfo(input);
      router.push(Navigation.PAYMENT_LANDING);
    }
  };

  const handleEvent = (
    eventName: (typeof actionType)[keyof typeof actionType],
    payload?: BillSummaryDisplay
  ) => {
    switch (eventName) {
      case actionType.PAY_TOTAL_OUTSTANDING:
        if (payload) requestForPayNow(payload);
        break;
      case actionType.BILLING_PAGE:
        router.push(Navigation.BILLING);
        break;
    }
  };

  return (
    <>
      <AppHeader title="Dashboard" />
      <div className="flex-1 px-0 py-4">
        <AccountList />

        {!configuration && configLoading ? (
          <TrackDetailsSkeleton />
        ) : configuration ? (
          <TrackDetails configuration={configuration} />
        ) : null}

        {!configuration && configLoading ? (
          <ManageServiceSkeleton />
        ) : (
          <ServicePage configuration={configuration} />
        )}

        <div className="max-w-md mx-auto">
          <BillingWidget
            accountNo={selected?.accountNo ?? ""}
            currentPage="1"
            onEventHandler={handleEvent}
          />

          {bannerLoading ? (
            <BannerSliderSkeleton />
          ) : slides?.length > 0 ? (
            <BannerSlider
              slides={slides}
              onClick={(slide) => slide.link && window.open(slide.link)}
            />
          ) : (
            <BannerSliderSkeleton />
          )}
        </div>

        <ManageService />
      </div>
    </>
  );
}
