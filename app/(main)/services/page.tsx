"use client";

import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAccount } from "@/context/AccountContext";
import { useConfig } from "@/context/ConfigContext";
import { useServiceContext } from "@/context/ServiceContext";
import { useServiceTypes } from "@/hooks/useServiceTypes";
import { accountService } from "@/core/services/account.service";
import { getAllLines, getLineTypeCount } from "@/core/services/master.service";
import { ResponseCodeEnum, UserTypeEnum } from "@/shared/enum";
import type {
  LineDetailsModel,
  LineCountListDataModel,
} from "@/shared/models";
import { getServiceCategoryTabs } from "@/lib/utils/service-tabs";
import { mapServiceTypes } from "@/lib/utils/service-mapper";
import { calculateOffset } from "@/lib/utils/pagination";
import BackButtonAuth from "@/components/ui/BackButton";
import GenericFilters from "@/components/filters/GenericFilters";
import Pagination from "@/components/ui/Pagination";
import ServiceTabs from "@/components/services/ServiceTabs";
import ServiceList from "@/components/services/ServiceList";
import ServiceListSkeleton from "@/components/services/ServiceListSkeleton";
import TrackDetails from "@/components/dashboard/TrackDetails";
import TrackDetailsSkeleton from "@/components/dashboard/TrackDetailsSkeleton";

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const { selected } = useAccount();
  const { config } = useConfig();
  const { service, setService } = useServiceContext();
  const configuration = (config as { result?: { public?: Record<string, unknown> } })?.result?.public;
  const productType = (configuration?.ProductType ?? []) as unknown[];
  const getUserDetails = accountService.getUser();
  const role = accountService.getEnterPriseRole();

  const [loading, setLoading] = useState(true);
  const [noRecords, setNoRecords] = useState(false);
  const [lineDetailsData, setLineDetailsData] = useState<LineDetailsModel[]>([]);
  const [linesCount, setLinesCountData] = useState<LineCountListDataModel[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>({});
  const [totalLinesRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLines, setTotalLines] = useState(0);
  const itemsPerPage = 10;

  const {
    getAllServiceTypes,
    getServiceTypeListByCategory,
    currentServiceType,
    setCurrentServiceType,
  } = useServiceTypes({ productType });

  const [activeServiceTypeByCategory, setActiveServiceTypeByCategory] = useState<string[]>([]);
  const [serviceTypesArr, setServiceTypes] = useState<{ label: string; value: string }[]>([]);

  useEffect(() => {
    const types = getAllServiceTypes();
    setServiceTypes(types);
  }, [getAllServiceTypes]);

  useEffect(() => {
    const t = typeParam ?? service ?? "MOBILE";
    setService(t);
    setCurrentServiceType(t);
    const list = getServiceTypeListByCategory(t);
    setActiveServiceTypeByCategory(list);
  }, [typeParam, service, setService, setCurrentServiceType, getServiceTypeListByCategory]);

  useEffect(() => {
    const fetchAllLines = async () => {
      if (!selected || !activeServiceTypeByCategory?.length) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setNoRecords(false);
      try {
        const user = getUserDetails ?? {};
        const input = {
          accountNo: selected.accountNo,
          contactPersonEmailId: (user as { email?: string }).email,
          contactPersonMsisdn: (user as { msisdn?: string }).msisdn ?? selected.contactPersonMsisdn,
          offset: calculateOffset(currentPage, itemsPerPage),
          limit: itemsPerPage,
          showVIP: true,
          serviceTypes: activeServiceTypeByCategory,
          ...(appliedFilters?.status && { lineStatus: appliedFilters.status }),
          ...(appliedFilters?.subService && { lineType: appliedFilters.subService }),
        };
        const lineDetails = await getAllLines(input);
        if (
          lineDetails.statusCode === ResponseCodeEnum.SUCCESS &&
          lineDetails.result?.lines?.length
        ) {
          setLineDetailsData(lineDetails.result.lines);
          setTotalRecords(lineDetails.result.totalRecords ?? 0);
          setNoRecords(false);
        } else {
          setLineDetailsData([]);
          setNoRecords(true);
        }
      } catch {
        setLineDetailsData([]);
        setNoRecords(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAllLines();
  }, [
    selected,
    currentPage,
    activeServiceTypeByCategory,
    appliedFilters,
    getUserDetails,
  ]);

  const fetchCategoryData = async (type: string) => {
    if (!selected || !activeServiceTypeByCategory?.length) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setNoRecords(false);
    setLinesCountData([]);
    try {
      const user = getUserDetails ?? {};
      let baseInput = {
        accountNo: selected.accountNo,
        contactPersonEmailId: (user as { email?: string }).email,
        contactPersonMsisdn: (user as { msisdn?: string }).msisdn ?? selected.contactPersonMsisdn,
        serviceTypes: activeServiceTypeByCategory,
        showVIP: true,
      };
      let roleSpecificInput: Record<string, unknown> = {};
      switch (role) {
        case UserTypeEnum.KAMUSER:
          roleSpecificInput = {
            auuid: (user as { auuid?: string }).auuid,
            contactPersonEmailId: (user as { contactPersonEmailId?: string }).contactPersonEmailId,
            contactPersonMsisdn: (user as { contactPersonMsisdn?: string }).contactPersonMsisdn,
          };
          break;
        case UserTypeEnum.VIEW_ADMIN:
        case UserTypeEnum.ADMIN:
          roleSpecificInput = {
            parentDTO: {
              parentEmailId: selected.contactPersonMsisdn,
              parentMsisdn: selected.contactPersonMsisdn,
            },
          };
          break;
      }
      const input = { ...baseInput, ...roleSpecificInput };
      const lineCountResponse = await getLineTypeCount(input);
      if (
        lineCountResponse?.result?.services?.length &&
        lineCountResponse.result.services.length > 0
      ) {
        setLinesCountData(lineCountResponse.result.services);
        const total =
          lineCountResponse.result.services
            ?.flatMap((s) => s.lines ?? [])
            .reduce((sum, l) => sum + (Number(l?.count) ?? 0), 0) ?? 0;
        setTotalLines(total);
      } else {
        setTotalLines(0);
        setNoRecords(true);
      }
    } catch {
      setNoRecords(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeServiceTypeByCategory?.length) {
      fetchCategoryData(currentServiceType ?? "MOBILE");
    }
  }, [activeServiceTypeByCategory]);

  const tabServiceCategory = getServiceCategoryTabs(
    configuration,
    role ?? undefined,
    serviceTypesArr
  );
  const services = mapServiceTypes(tabServiceCategory);

  const handleFilterChange = (filters: Record<string, string>) => {
    setAppliedFilters(filters);
  };

  const handleTabChange = (tab: string) => {
    setCurrentServiceType(tab);
    setService(tab);
    const list = getServiceTypeListByCategory(tab);
    setActiveServiceTypeByCategory(list);
  };

  return (
    <div className="pb-20">
      <div className="bg-white pt-4 pl-5 max-w-md mx-auto">
        <BackButtonAuth title="Services" onBack={() => window.history.back()} />
      </div>
      <ServiceTabs
        tabs={services}
        activeTab={currentServiceType}
        setActiveTab={handleTabChange}
      />

      {!configuration ? (
        <TrackDetailsSkeleton />
      ) : (
        <motion.section
          className="mt-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <TrackDetails configuration={configuration} />
        </motion.section>
      )}

      <GenericFilters onFilterChange={handleFilterChange} />

      <motion.section className="mt-5 bg-white mx-2.5 rounded-lg">
        {loading ? (
          <div className="p-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        ) : (
          <p className="p-2 text-sm font-semibold text-neutral-800">
            Total Lines : <span className="font-bold">{totalLines}</span>
          </p>
        )}
      </motion.section>

      <motion.section className="mt-2 mx-2.5">
        {loading ? (
          <ServiceListSkeleton />
        ) : lineDetailsData.length === 0 || noRecords ? (
          <div className="text-center py-10 text-neutral-500 text-sm bg-white rounded-lg mx-2">
            No results found
          </div>
        ) : (
          <ServiceList items={lineDetailsData} />
        )}
      </motion.section>

      <div className="py-0 px-2.5">
        {lineDetailsData.length > 1 && (
          <Pagination
            totalItems={totalLinesRecords}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
