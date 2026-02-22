"use client";

import { useAccount } from "@/context/AccountContext";
import { Navigation } from "@/core/constant";
import { AccountDetailsModel } from "@/shared/models";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface AccountDetailsProps {
  account: AccountDetailsModel;
  onClose: () => void;
  onPayNow: (account: AccountDetailsModel) => void;
}

export default function AccountDetailsModal({
  account,
  onClose,
  onPayNow
}: AccountDetailsProps) {
  const router = useRouter();
    const {
      ecareaccounts,
      selectedIndex,
      select,
      selected,
      loadMore,
      isLoadingMore,
      hasMore,
    } = useAccount();
    
  const onViewAccount = () => {
    router.push(Navigation.INDIVIDUAL_ACCOUNT)
  }
  return (
    <div className="fixed inset-0   z-999 bg-custom-overlay  bg-opacity-30 flex items-end justify-center">
      <div className="w-full max-w-md bg-white rounded-t-lg shadow-lg p-4 animate-slide-up relative">
        <h4 className="text-base font-bold text-black mb-4">
          Account Details
        </h4>
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-500 text-xl"
        >
          &times;
        </button>

        <div className="space-y-4 text-sm text-black leading-[26px]">
          {/* First Row: Account Number & Account Name */}
          <div className="flex justify-between">
            <div>
              <p className="font-bold text-xs text-black-600">Account Number</p>
              <p className="text-gray-800">{account.accountNo}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xs">Account Name</p>
              <p className="text-gray-800">{account.accountName}</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex justify-between leading-[26px]">
            <div>
              <p className="font-bold text-xs">Contact Person</p>
              <p className="text-gray-800 leading-[21px]">
                {account.contactPersonfirstName} {account.contactPersonlastName} <br/>
                {account.contactPersonMsisdn} <br/>
                {account.contactPersonEmailId}
            </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xs">Security Deposit </p>
              <p className="text-gray-800">{account.billSummaryModel?.currency} {account.billSummaryModel?.securityDeposit}</p>
            </div>
          </div>

          {/* Financial Info */}

          <div className="flex justify-between leading-[26px]">
            <div>
              <p className="font-bold text-xs">Outstanding Amount</p>
              <p onClick={() => onPayNow(account)}>
                {account.billSummaryModel?.currency} {account.billSummaryModel?.totalOutstandingAmount}
                <span className="flex text-red-500 font-semibold">PAY NOW</span>
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xs ">Overdue Amount</p>
              <p>{account.billSummaryModel?.totalOverdueAmount}</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <p className="font-bold text-xs ">Account Services</p>
            {/* <p>{account.services.join(", ")}</p> */}
          </div>

          {/* CTA */}
          <button className="w-full mt-4 py-2 bg-red-500 text-white rounded-md text-center" onClick={onViewAccount}>
            View Account
          </button>
        </div>
      </div>
    </div>
  );
}
