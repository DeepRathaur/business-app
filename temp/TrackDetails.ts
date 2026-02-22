"use client";

import { useState } from "react";
import MobileNoCheck from "../mobile-no/MobileNo";
import RadioGroup from "@/features/form_modules/components/form/inputs/RadioGroups";
import { ResponseCodeEnum, TrackTypeEnum } from "@/shared/enum";
import {
  AppConfiguration,
  FetchSingleOpportunitiesResponseModel,
} from "@/shared/models";
import { getOpportunityByOrderNo } from "@/services/masterService";

import { useRouter } from "next/navigation";
import { useInterModuleNavigationService } from "@/hooks";

interface Props {
  configuration: AppConfiguration;
}

export default function TrackDetails({ configuration }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const navigation = useRouter();

  const [selectedOption, setSelectedOption] = useState<TrackTypeEnum>(
    TrackTypeEnum.MOBILE
  );
  const options: { label: string; value: TrackTypeEnum }[] = [
    { label: "Mobile Number", value: TrackTypeEnum.MOBILE },
    { label: "Order", value: TrackTypeEnum.OPPORTUNITY },
  ];

  const handleTrackCheck = (value: string) => {
    setInputValue(value);
    setLoading(true);
    setError("");
    setResult(null);

    if (selectedOption === TrackTypeEnum.MOBILE) {
      handleMobileCheck(value);
    } else if (selectedOption === TrackTypeEnum.OPPORTUNITY) {
      handleOpportunityCheck(value);
    }

    setLoading(false);
  };
  const { toLineDetailes, toOrderDetails } =
    useInterModuleNavigationService();
  const handleMobileCheck = (mobile: string) => {
    console.log("Mobile Check Handler:", mobile);
    //navigate toLineDetailesto line details page with mobile no
    toLineDetailes(mobile);
    setResult({ type: "mobile", value: mobile });
  };

  const handleOpportunityCheck = async (order: string) => {
    try {
      const response: FetchSingleOpportunitiesResponseModel = await getOpportunityByOrderNo(order);
      console.log("Fetched opportunity orders:", response);
      if (response && response.statusCode === ResponseCodeEnum.SUCCESS) {
        toOrderDetails(response.result);
      } else {
        
      }
    } catch (error) {
      console.error("Failed to load layout:", error);
    }
    setResult({ type: "opportunity", value: order });
  };

  return (
      
      <>
        <MobileNoCheck
        opportunityLoader={false}
        trackDetailsType={selectedOption}
        pattern={configuration?.PATTERN}
        allowHyphen={true}
        validation={configuration?.OPCO_CONFIG.VALIDATIONS}
        onClick={handleTrackCheck}
        />
      </>
      
  );
}