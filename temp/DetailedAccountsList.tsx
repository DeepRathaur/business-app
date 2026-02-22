"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Pagination from "../pagination/Pagination";
import AccountDetailsModal from "./AccountDetailsModal";
import {
  AccountDetailsModel,
  AppConfiguration,
  BillSummaryResponseModel,
  GetBillSummaryModel,
  TransactionInfoModel,
} from "@/shared/models";
import SearchWidget from "../search-widget/SearchWidget";
import { accountService } from "@/core/service/accountService";
import { UserTypeEnum } from "@/shared/enum/ums-user-status.enum";
import { loadBillSummary } from "@/services/masterService";
import { LimitedActiosEnum, PaymentModeEnum, ResponseCodeEnum, SelfServiceEnum, TransactionTypeEnum } from "@/shared/enum";
import { getFilteredActions } from "@/utills";
import { useInterModuleNavigationService } from "@/hooks";
import { useRouter } from "next/navigation";
import { Navigation } from "@/core/constant";

interface Account {
  id: string;
  label: string;
  amount: string;
}

interface AccountPanelProps {
  accounts: AccountDetailsModel[];
  currentPage: number;
  loading: boolean;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  totalRecords: number;
  configuration: AppConfiguration;
}

export default function DetailedAccountList({
  accounts,
  currentPage,
  loading,
  itemsPerPage,
  onPageChange,
  totalRecords,
  configuration,
}: AccountPanelProps) {
  const [search, setSearch] = useState("");
  const [setCurrentPage] = useState(1);
  const [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<any | null>(null);
  const [actions, setActions] = useState<any>([]);
  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.accountNo.includes(search) ||
      acc.accountName.toLowerCase().includes(search.toLowerCase())
  );
  const router = useRouter();
  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const fetchBillSummary = async (accountNo: string) => {
    try {
      const getUserDetails = accountService.getUser();

      let input: any = { accountNo };

      switch (accountService.getEnterPriseRole()) {
        case UserTypeEnum.KAMUSER:
          Object.assign(input, {
            auuid: getUserDetails.auuid,
            showVIP: true,
            contactPersonEmailId: getUserDetails.contactPersonEmailId,
            contactPersonMsisdn: getUserDetails.contactPersonMsisdn,
          });
          break;
        case UserTypeEnum.ADMIN:
        case UserTypeEnum.SUPER_ADMIN:
        case UserTypeEnum.VIEW_ADMIN:
          Object.assign(input, {
            showVIP: true,
            contactPersonEmailId: getUserDetails.email,
            contactPersonMsisdn: getUserDetails.msisdn,
          });
          break;
      }

      const response: BillSummaryResponseModel = await loadBillSummary(input);

      if (response.statusCode === ResponseCodeEnum.SUCCESS) {
        return response.result;
      }
    } catch (error) {
      console.error("Failed to fetch billing summary:", error);
    } finally {
      // setLoading(false);
    }
  };

  const [billSummaries, setBillSummaries] = useState<
    Record<string, GetBillSummaryModel>
  >({});

  const [fetchedAccounts, setFetchedAccounts] = useState<Set<string>>(
    new Set()
  );
  const { toFormRenderer } = useInterModuleNavigationService();

  useEffect(() => {
    const fetchAllSummaries = async () => {
      const summaries: Record<string, GetBillSummaryModel> = {};
      const newFetchedAccounts = new Set(fetchedAccounts);

      for (const account of paginatedAccounts) {
        if (!newFetchedAccounts.has(account.accountNo)) {
          const summary = await fetchBillSummary(account.accountNo);
          if (summary) {
            summaries[account.accountNo] = summary;
            newFetchedAccounts.add(account.accountNo);
          }
        }
      }

      if (Object.keys(summaries).length > 0) {
        setBillSummaries((prev) => ({ ...prev, ...summaries }));
        setFetchedAccounts(newFetchedAccounts);
      }
    };

    fetchAllSummaries();
  }, [paginatedAccounts]);

  useEffect(() => {
    getAllActions();
  },[])

  const handlePageChange = (page: number) => {
    // setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearch(query);
  };

  const downloadHandler = () => {
    console.log("download click");
  };

  const requestForPayNow = (payload:AccountDetailsModel) => {
    console.log("PayNow");
    if(configuration && payload.billSummaryModel) {
        const currencyConf = configuration?.replaceCurrencyConf ?? null; 
        if (currencyConf && payload.billSummaryModel?.currency === currencyConf.currency) {
          payload.billSummaryModel.currency = currencyConf.replaceWith;
        } 
        const input: TransactionInfoModel = {
        accountNo : payload.accountNo,
        invoiceNo : payload.billSummaryModel?.invoiceNo,
        outstandingAmount : payload.billSummaryModel?.totalOutstandingAmount,
        overdueAmount : payload.billSummaryModel?.totalOverdueAmount,
        dueDate : payload.billSummaryModel?.dueDate,
        clientName : selectedAccount.accountName??"",
        currency : payload.billSummaryModel?.currency,
        amount : payload.billSummaryModel?.totalOutstandingAmount.toString(),
        mode : PaymentModeEnum.INVOICE,
        mobileNumber :selectedAccount.contactPersonMsisdn??"",
        serviceName : TransactionTypeEnum.POSTPAID_BILL,
        transactionType : TransactionTypeEnum.POSTPAID_BILL,
        countryCode:configuration?.OPCO_CONFIG.COUNTRY_CODE
      }
      accountService.setTxnInfo(input);
      router.push(Navigation.PAYMENT_LANDING);
      } else {
        console.log("accaount no  and configuration invalid");
      }
  };

  const getAllActions = async () => {
    if (configuration) {
      const actions = getFilteredActions(
        configuration,
        LimitedActiosEnum.ON_ACCOUNT
      );
      const visibleActions = actions.filter((action) => action.featureEnable);
      setActions(visibleActions);
      // toFormRenderer(visibleActions[0]);
    }
  };

  const raiseServiceRequest = (service: any) => {
    const route = `/${service.name.replace(/\s+/g, "-").toLowerCase()}`;
    if (service.eventType === SelfServiceEnum.ROUTE) {
      router.push(route);
    } else {
      toFormRenderer(service);
    }
    return;
  };

  return (
    <>
      <div className="py-2">
        <h4 className="text-base font-bold text-black">Account Details</h4>
      </div>
      <SearchWidget
        showDownload={false}
        onSearch={handleSearch}
        onDownload={downloadHandler}
      />
      {/* Account List */}
      <div className="space-y-3">
        {paginatedAccounts.map((account, index) => {
          const summary = billSummaries[account.accountNo];

          const handleSelectAccount = () => {
            setSelectedAccount({
              ...account,
              billSummaryModel: summary || null,
            });
          };

          return (
            <div
              key={index}
              className="card mb-2"
            >
              <div className="flex justify-between items-center" onClick={handleSelectAccount}>
             <div className="left">
             <h4 className="text-[14px] text-gray-600 uppercase">
                  {account.accountNo}
                </h4>
                <h2 className="text-base text-black uppercase font-bold mb-2 text-[14px]">
                  {account.accountName}
                </h2>
                <div className="flex items-center">
                  <Image
                    src="/images/icons/wallet.svg"
                    alt="Wallet"
                    width={18}
                    height={18}
                    className=" grayscale-[1] mr-2"
                  />

                <span className="text-base text-gray-500 uppercase  mb-1">
                  {loading
                    ? "Loading..."
                    : `${summary?.currency ?? ""} ${summary?.totalOutstandingAmount ?? "N/A"}`}
                </span>

                </div>

              </div>

              <div className="right mr-[-12px]">
                <button
                  onClick={() =>
                    setMenuOpenIndex(index === menuOpenIndex ? null : index)
                  }
                >
                  <Image
                    src="/images/icons/more-red.svg"
                    alt="Options"
                    width={40}
                    height={40}
                   
                  />
                </button>
              </div> </div>

              {menuOpenIndex === index && (
                <div className="pb-17 fixed inset-0 z-50 bg-custom-overlay  bg-opacity-30 flex items-end justify-center">
                  <div className="w-full max-w-md bg-white rounded-t-lg shadow-lg p-4 animate-slide-up relative">
                    <button
                      onClick={() => setMenuOpenIndex(null)}
                      className="absolute top-2 right-4 text-gray-500 text-xl"
                    >
                      &times;
                    </button>
                    <div className="space-y-2 text-sm pt-6">
                      {actions &&
                        actions.map((action: any, index: number) => (
                        <button
                            key={action.requestName}
                            className="text-red-600 border px-2 py-2 text-xs font-medium hover:bg-red-50 w-full"
                            onClick={() => raiseServiceRequest(action)}
                          >
                            {action.name}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {accounts.length > 0 && (
        <Pagination
          totalItems={totalRecords}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}

      {selectedAccount && (
        <AccountDetailsModal
          account={selectedAccount}
          onClose={() => setSelectedAccount(null)}
          onPayNow={requestForPayNow}
        />
      )}
    </>
  );
}
