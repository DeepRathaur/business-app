"use client";

import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import ServiceTabs from "./ServiceTabs";
import ServiceList from "./ServiceList";
import ServiceListSkeleton from "./ServiceListSkeleton";
import { OptionsModel } from "@/shared/models/options.model";
import { ServiceCategoryEnum } from "@/shared/enum/service-category.enum";
import { accountService } from "@/core/service/accountService";
import { ConfigContext } from "@/context/ConfigContext";
import { useServiceTypes } from "@/hooks";
import { getServiceCategoryTabs } from "@/utills";
import { mapServiceTypes } from "@/utills/serviceMapper";
import BackButtonAuth from "@/shared/components/back-button/BackButtonAuth";
import TrackDetailsSkeleton from "@/shared/skelton/TrackDetailsSkeleton";
import TrackDetails from "@/shared/components/track-details/TrackDetails";
import GenericFilters from "@/shared/components/search-widget/Filters";
import { GetLineCountModel, GetLineDetailsModel, LineCountListDataModel, LineCountResponseModel, LineDetailsModel, LineDetailsResponseModel } from "@/shared/models";
import { getAllLines, getLineTypeCount } from "@/services/masterService";
import { ResponseCodeEnum, UserTypeEnum } from "@/shared/enum";
import { ToastType } from "@/shared/enum/toaster.enum";
import { useToast } from "@/context/ToastProvider";
import { useAccount } from "@/context/AccountContext";
import Pagination from "@/shared/components/pagination/Pagination";
import { calculateOffset } from "@/utills/commonUtils";
import { useServiceContext } from "@/context/ServiceContext";

export default function ServiceScreen() {
  const [loading, setLoading] = useState(true);
  const [noRecords, setNoRecords] = useState(false);
  const { showToast } = useToast();
  const [lineDetailsData, setLineDetailsData] = useState<LineDetailsModel[]>([]);
  const { ecareaccounts, selected, totalRecords } = useAccount();
  const [linesCount, setlinesCountData] = useState<LineCountListDataModel[]>(
    []
  );

  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );
  const [totalLinesRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalLines, setTotalLines] = useState<number>(0);

  const [serviceTypesArr, setServiceTypes] = useState<OptionsModel[]>([]);
  const [currentCategory, setCurrentCategory] =
    useState<ServiceCategoryEnum>();
  const { config } = useContext(ConfigContext);
  const configuration = config?.result.public;
  const getUserDetails = accountService.getUser();
  const { service, setService } = useServiceContext();

  const role = accountService.getEnterPriseRole();
  const productType = configuration?.ProductType ?? [];
  const {
    getAllServiceTypes,
    getServiceTypeListByCategory,
    serviceTypeList,
    currentServiceType,
    setCurrentServiceType,
  } = useServiceTypes({ productType });

  const [activeServiceTypeByCategory, setActiveServiceTypeByCategory] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchAllLines = async () => {
      setLoading(true);
      setNoRecords(false);
      try {
        console.log("currentServiceType==",currentServiceType);
        const getUserDetails = accountService.getUser();
        if(selected) {
          const input: GetLineDetailsModel = {
            accountNo: selected?.accountNo,
            contactPersonEmailId: getUserDetails.email,
            contactPersonMsisdn: getUserDetails.msisdn,
            offset: calculateOffset(currentPage, itemsPerPage),
            limit: itemsPerPage,
            showVIP: true,
            serviceTypes:activeServiceTypeByCategory,
              ...(appliedFilters && {
                lineStatus: appliedFilters.status,
                lineType: appliedFilters.subService,
              })
          };
          const lineDetails: LineDetailsResponseModel = await getAllLines(input);
          if (
            lineDetails.statusCode === ResponseCodeEnum.SUCCESS &&
            lineDetails.result?.lines.length > 0
          ) {
            setNoRecords(lineDetails.result.lines.length === 0);
            setLineDetailsData(lineDetails.result.lines);
            
            setTotalRecords((prev) =>
              lineDetails.result?.totalRecords &&
              lineDetails.result.totalRecords > 0
                ? lineDetails.result.totalRecords
                : prev
            );
          } else {
            setNoRecords(true);
            showToast(lineDetails.message as string, ToastType.error);
          }
        }
      } catch (error) {
        setNoRecords(true);
        console.error("Error fetching ticket history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (
      selected &&
      currentServiceType &&
      activeServiceTypeByCategory &&
      activeServiceTypeByCategory.length > 0
    ) {
      fetchAllLines();
    }
  }, [currentServiceType, currentPage]);



  const fetchCategoryData = async (type: string) => {
      setLoading(true);
      setNoRecords(false);
      setlinesCountData([]);
      if(selected && type) {
        let baseInput: GetLineCountModel = {
          accountNo: selected?.accountNo,
          contactPersonEmailId: getUserDetails.email,
          contactPersonMsisdn: getUserDetails.msisdn,
          serviceTypes: activeServiceTypeByCategory,
          showVIP: true,
        };
        let roleSpecificInput: Partial<GetLineCountModel> = {};
        switch (accountService.getEnterPriseRole()) {
          case UserTypeEnum.KAMUSER:
            roleSpecificInput = {
              auuid: getUserDetails.auuid,
              contactPersonEmailId: getUserDetails.contactPersonEmailId,
              contactPersonMsisdn: getUserDetails.contactPersonMsisdn,
            };
            break;
          case UserTypeEnum.VIEW_ADMIN:
          case UserTypeEnum.ADMIN:
            roleSpecificInput = {
              parentDTO: {
                parentEmailId: selected?.contactPersonEmailId,
                parentMsisdn: selected?.contactPersonMsisdn,
              },
            };
            break;
        }
    
        const input: GetLineCountModel = {
          ...baseInput,
          ...roleSpecificInput,
        };
    
        try {
          const lineCountResponse: LineCountResponseModel = await getLineTypeCount(
            input
          );
  
          if (lineCountResponse && lineCountResponse.result?.services?.length > 0) {
            const lineCounts = lineCountResponse.result.services.map(
              (item: LineCountListDataModel) => ({
                lines: item.lines,
                serviceType: item.serviceType,
              })
            );
            setlinesCountData(lineCounts);
            const totalLines =
            Array.isArray(lineCountResponse.result?.services)
              ? lineCountResponse.result.services
                  .flatMap(s => Array.isArray(s.lines) ? s.lines : [])
                  .reduce((sum, l) => sum + (Number(l?.count) || 0), 0)
              : 0;
              setTotalLines(totalLines);
            return lineCounts;
          } else {
            setTotalLines(0);
            setNoRecords(true);
          }
      
      } catch (error) {
        setNoRecords(true);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (service) {
      setCurrentServiceType(service);
      setCurrentCategory(service);
      const serviceTypeByCategory = getServiceTypeListByCategory(service);
      setActiveServiceTypeByCategory(serviceTypeByCategory);
    }
  }, [service]);

 useEffect(() => {
    if (activeServiceTypeByCategory &&
      activeServiceTypeByCategory.length > 0) {
      fetchCategoryData(service);
    }
  }, [activeServiceTypeByCategory]);


  useEffect(() => {
    const types = getAllServiceTypes();
    setServiceTypes(types);
  }, []);

  const tabServiceCategory = getServiceCategoryTabs(
    configuration,
    role,
    serviceTypesArr
  );

  const services = mapServiceTypes(tabServiceCategory);

  const handleFilterChange = (filters: Record<string, string>) => {
    console.log("Applied Filters:", filters);
    setAppliedFilters(filters)
  }

  const handleTabChange = (tab: ServiceCategoryEnum) => {
    console.log("Active Tab:", tab);
    setCurrentCategory(tab);
    setCurrentServiceType(tab);
    const serviceTypeByCategory = getServiceTypeListByCategory(tab);
    setActiveServiceTypeByCategory(serviceTypeByCategory);
    console.log("Active serviceTypeByCategory:", serviceTypeByCategory);
  };


  return (
    <div className="pb-20">
      {/* Tabs */}
      <div className="bg-white pt-4 pl-5 max-w-md mx-auto">
        <BackButtonAuth
          title="Services"
          onBack={() => window.history.back()}
        />
      </div>
      <ServiceTabs tabs={services} activeTab={currentServiceType} setActiveTab={handleTabChange} />

      {/* Search */}
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


      {/* Floating Filters Button */}
      <GenericFilters onFilterChange={handleFilterChange} />

      {/* Total Lines */}
      
      <motion.section className="mt-5 bg-white mx-2.5">
        {loading ? (
          <div className="p-2">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <p className="p-2 text-sm font-color-text font-semibold inline-flex items-center gap-1">
            Total Lines : <span className="font-bold">{totalLines}</span>
          </p>
        )}
      </motion.section>

     

      {/* List */}
      <motion.section className="mt-2 mx-2.5">
        {loading ? (
          <ServiceListSkeleton />
        ) : lineDetailsData.length === 0 || noRecords ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            No results found
          </div>
        ) : (
          <>
          <ServiceList items={lineDetailsData} />
          </>
          
        )}
      </motion.section>

      <div className="py-0 px-[10px]">
        {lineDetailsData && lineDetailsData.length > 1 && (
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