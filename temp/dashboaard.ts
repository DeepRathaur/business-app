"use client";
import { AccountList } from "@/components/account-list/AccountList";
import { useAccount } from "@/context/AccountContext";
import { useAuth } from "@/context/AuthContext";
import { ConfigContext } from "@/context/ConfigContext";
import { useToast } from "@/context/ToastProvider";
import { Navigation } from "@/core/constant";
import { actionType } from "@/core/enum";
import { accountService } from "@/core/service/accountService";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { bannerSaveData, getBannerConfiguration } from "@/services/masterService";
import DetailedAccountList from "@/shared/components/account-list/DetailedAccountsList";
import BottomNav from "@/shared/components/BottomNav";
import Footer from "@/shared/components/Footer";
import BillingWidget from "@/shared/components/outstanding-amount/BillingWidget";
import RecentSRsWithCreateMenu from "@/shared/components/recent-sr-chip/RecentSRsWithCreateMenu";
import BannerSlider from "@/shared/components/slider/BannerSlider";
import ProductServiceOptions from "@/shared/components/track-details/ProductServiceOptions";
import TrackDetails from "@/shared/components/track-details/TrackDetails";
import { message_constant } from "@/shared/constant/message.constant";
import { PaymentModeEnum, ResponseCodeEnum, TransactionTypeEnum } from "@/shared/enum";
import { ToastType } from "@/shared/enum/toaster.enum";
import { BannerModel, BannerResponseModel, GetBillSummaryModel, TransactionInfoModel } from "@/shared/models";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

import Image from 'next/image';
import ManageService from "./ManageService";
import BannerSliderSkeleton from "@/shared/skelton/BannerSliderSkeleton";
import TrackDetailsSkeleton from "@/shared/skelton/TrackDetailsSkeleton";
import ManageServiceSkeleton from "@/shared/skelton/ManageServiceSkeleton";
import ServicePage from "./ServicePage";

const services = [
  { icon: '/images/mobile-icon.svg', label: 'Mobile' },
  { icon: '/images/m2m-icon.svg', label: 'M2M' },
  { icon: '/images/fixedline-icon.svg', label: 'Fixedline' },
  { icon: '/images/fttx-icon.svg', label: 'FTTX' },
  { icon: '/images/fiberco-icon.svg', label: 'FiberCo' },
];

export default function Dashboard() {
  const isAuthenticated = useAuthGuard();
  const { ecareaccounts, selected, totalRecords } = useAccount();
  const { config, loading, error } = useContext(ConfigContext);
  const { setIsAuthed } = useAuth()
  const router = useRouter();
  const { showToast } = useToast();
  const configuration = config?.result.public;
  const socialLinks = configuration?.socialLinks || [];
  const [slides, setSlides] = useState<BannerModel[]>([]);

  const getBannerConf = async () => {
    const response: BannerResponseModel = await getBannerConfiguration();
    if (response.statusCode === ResponseCodeEnum.SUCCESS) {
      setSlides(response.result);
      setIsAuthed(true);
    } else {
      showToast(response.message || message_constant.SOMETHING_WENT_WRONG, ToastType.error)
    }
  }


  useEffect(() => {
    getBannerConf();
  }, []);

  useEffect(() => {
    if (selected?.accountNo) {

    }
  }, [selected?.accountNo]);

  const handleClick = (actionType: string) => {
    console.log("Clicked action:", actionType);
  };

  const handleImageClick = async (slide: BannerModel) => {
    console.log("Clicked action:", slide);
    setIsAuthed(true);
    try {
      const input: BannerModel = {
        accountName: selected?.accountName,
        accountNo: selected?.accountNo,
        name: slide.name,
        imageUri: slide.imageUri,
        link: slide.link,
      }
      const response: BannerResponseModel = await bannerSaveData(input);
      console.log("Fetched account statement data :", response);
      if (response && response.statusCode === ResponseCodeEnum.SUCCESS) {
        console.log("Image data saved");
        window.open(slide.link)
      } else {
      }
    } catch (error) {
      console.error("Failed to load layout:", error);
    } finally {
    }
    bannerSaveData;
  };


  const requestForPayNow = (payload: GetBillSummaryModel) => {
    if (selected && configuration) {
      const currencyConf = configuration?.replaceCurrencyConf ?? null;
      if (currencyConf && payload.currency === currencyConf.currency) {
        payload.currency = currencyConf.replaceWith;
      }
      const input: TransactionInfoModel = {
        accountNo: payload.accountNo,
        invoiceNo: payload.invoiceNo,
        outstandingAmount: payload.totalOutstandingAmount,
        overdueAmount: payload.totalOverdueAmount,
        dueDate: payload.dueDate,
        clientName: selected?.accountName,
        currency: payload.currency,
        amount: payload.totalOutstandingAmount.toString(),
        mode: PaymentModeEnum.INVOICE,
        mobileNumber: selected?.contactPersonMsisdn,
        serviceName: TransactionTypeEnum.POSTPAID_BILL,
        transactionType: TransactionTypeEnum.POSTPAID_BILL,
        countryCode: configuration?.OPCO_CONFIG.COUNTRY_CODE
      }
      accountService.setTxnInfo(input);
      router.push(Navigation.PAYMENT_LANDING);
    } else {
      console.log("accaount no  and configuration invalid");
    }
  }

  const handleEvent = (eventName: actionType, payload?: GetBillSummaryModel) => {
    console.log("Event:", eventName, "Payload:", payload);
    switch (eventName) {
      case actionType.PAY_TOTAL_OUTSTANDING:
        if (payload)
          requestForPayNow(payload);
        break;

      case actionType.BILLING_PAGE:
        router.push(Navigation.BILLING)
        break;
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  };

  return (
    <>
      <AccountList />

      {!configuration ? (
        <TrackDetailsSkeleton />
      ) : (
        <div className="pt-10">
           <TrackDetails configuration={configuration} />
        </div>
      )}


      {!configuration ? (
        <ManageServiceSkeleton />
      ) : (
        <ServicePage configuration={configuration} />
      )}

      <div className="max-w-md mx-auto">
        <BillingWidget
          accountNo={selected?.accountNo ?? ""}
          currentPage={"1"}
          onClick={handleClick}
          onEventHandler={handleEvent}
        />
       
        {slides && slides.length > 0 ? (
          <BannerSlider slides={slides} onClick={handleImageClick} />
        ) : (
          <BannerSliderSkeleton />
        )}
      </div>


      <div className="min-h-[26vh]">
      <ManageService/>
      </div>

      <BottomNav />
    </>
  );
}