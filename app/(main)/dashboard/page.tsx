"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { AccountList } from "@/components/account-list/AccountList";
import MenuDrawer from "@/components/layout/MenuDrawer";
import BillingWidget from "@/components/dashboard/BillingWidget";
import BannerSlider from "@/components/dashboard/BannerSlider";
import BannerSliderSkeleton from "@/components/dashboard/BannerSliderSkeleton";
import TrackDetails from "@/components/dashboard/TrackDetails";
import TrackDetailsSkeleton from "@/components/dashboard/TrackDetailsSkeleton";
import ServicePage from "@/components/dashboard/ServicePage";
import ManageServiceSkeleton from "@/components/dashboard/ManageServiceSkeleton";
import ManageService from "@/components/dashboard/ManageService";

const MENU_BAR_HEIGHT = 48;

export default function DashboardPage() {
  const router = useRouter();
  const { config, loading: configLoading } = useConfig();
  const { selected, setAccounts } = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);
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
      <header
        className="fixed top-0 left-0 right-0 z-20 flex h-12 items-center bg-slate-900 px-3"
        style={{ height: MENU_BAR_HEIGHT }}
      >
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/10 active:bg-white/20"
          aria-label="Open menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="flex-1 text-center text-sm font-medium text-white">Dashboard</span>
        <div className="w-10 shrink-0" />
      </header>
      <AccountList topOffset={MENU_BAR_HEIGHT} />
      <MenuDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="flex-1 px-0 pt-24 pb-4">
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
