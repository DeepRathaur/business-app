"use client";

import DigitOnlyInput from "@/features/form_modules/components/form/inputs/DigitOnlyINput";
import { TrackTypeEnum } from "@/shared/enum";
import { PatternModel, validationModel } from "@/shared/models";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Props {
  opportunityLoader: boolean;
  trackDetailsType: TrackTypeEnum;
  pattern: PatternModel;
  allowHyphen?: boolean;
  validation: validationModel;
  onClick: (value: string) => void;
  defaultValue?: string; 
}

export default function MobileNoCheck({
  opportunityLoader,
  trackDetailsType,
  pattern,
  allowHyphen = false,
  validation,
  onClick,
  defaultValue = ''
}: Props) {
  const [mobileNo, setMobileNo] = useState(defaultValue);
  const [error, setError] = useState("");
  const [maxLength, setMaxLength] = useState(100);
  const [minLength, setMinLength] = useState(0);
  const [regex, setRegex] = useState<RegExp>(/.*/);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMobileNo(defaultValue);
    setError('');
    
    //auto focus on input
    if(inputRef.current) {
      inputRef.current.focus();
    }

    if (trackDetailsType === TrackTypeEnum.MOBILE) {
      setMaxLength(validation.lineMaxLength);
      setMinLength(validation.msisdnMinLength);
      setRegex(
        new RegExp(
          allowHyphen
            ? pattern.ALPHANUMERIC_WITH_DASH
            : pattern.ONLY_NUMBER
        )
      );
    } else {
      setMaxLength(100);
      setMinLength(validation.INVOICE_MIN_LENGTH);
      setRegex(new RegExp(pattern.ALPHANUMERIC_WITH_FRENCH));
    }
  }, [trackDetailsType, allowHyphen, pattern, validation, defaultValue]);

  const getPlaceholder = () => {
    if (trackDetailsType === TrackTypeEnum.MOBILE) {
      return "Enter mobile or line details";
    } else if (trackDetailsType === TrackTypeEnum.OPPORTUNITY) {
      return "Enter order number";
    }
    return "Enter mobile or line details";
  };

  const handleCheck = () => {
    if (
      mobileNo.length >= minLength &&
      mobileNo.length <= maxLength &&
      regex.test(mobileNo)
    ) {
      onClick(mobileNo);
      // setMobileNo("");
      if(inputRef.current) {
        inputRef.current.value = "";
      }
      setError("");
    } else {
      setError(Number length must be between ${minLength} and ${maxLength});
    }
  };

  return (
    <section className="px-2 pt-4">
      <div className="flex items-center rounded-md bg-white px-3 py-2 shadow-sm border border-solid border-[#D6D6D6]">
        <span className="mr-2 text-lg text-slate-400">
          <Image
            src="/images/icons/search-icon.svg"
            alt="Dropdown"
            width={14}
            height={14}
          />
        </span>
        {!opportunityLoader ? (
          <div className="flex">
            {trackDetailsType === TrackTypeEnum.MOBILE ? (
              <DigitOnlyInput
                value={mobileNo}
                onChange={setMobileNo}
                placeholder="Search By Mobile"
                maxLength={maxLength}
                className="form-control"
                pattern={regex}
                handleSearch= {handleCheck} 
              />
            ) : (
              <input
                type="text"
                ref={inputRef}
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                placeholder={getPlaceholder()}
                maxLength={maxLength}
                minLength={minLength}
                className="form-control m-[0px]"
              />
            )}

            
            {/* <button
              type="button"
              onClick={handleCheck}
              className="button min-w-[95px] min-h-[40px] leading-normal ml-[-1px] p-0"
            >
              Check
            </button> */}
          </div>
          
      ) : (
        <div className="flex justify-center items-center">
          <span className="loader">Loading...</span>
        </div>
      )}
      </div>
      {error && <p className="p-2 text-red-500 text-sm">{error}</p>}
    </section>
  );
}