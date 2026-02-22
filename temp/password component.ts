import { useTranslate } from "@/hooks";
import React, { ChangeEvent, useState } from "react";

interface PasswordProps {
  handlePasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
}


const Password : React.FC<PasswordProps> = ({ handlePasswordChange }) => {
    const t = useTranslate();
    const setPassword = (e: ChangeEvent<HTMLInputElement>) => {
        handlePasswordChange(e);
    }
    const [hide, setHide] = useState(true);

    return (
        <>

{/* Password */}
            <label className="mt-6 text-sm block text-gray-800 font-semibold">
            {t('USER_LOGIN.PASSWORD')} <span className="ml-1 text-red-600">*</span>
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type={hide ? 'password' : 'text'}
                onChange={(e) => setPassword(e)}
                placeholder="Enter password"
                className="w-full bg-transparent border-b border-gray-300 focus:border-gray-500 outline-none p-2 text-gray-800 placeholder:text-gray-400"
              />
              {/* eye icon placeholder */}
              <button
                type="button"
                className="shrink-0 h-5 w-5 rounded absolute right-[30px]"
                aria-label="toggle visibility"
                title="toggle visibility"
                onClick={() => setHide(!hide)}
              >
                <svg
                    className="h-[17px] w-[17px] text-[#707070]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                </svg>
              </button>
            </div>

            {/* <label className="form-label">{t('USER_LOGIN.PASSWORD')}*</label>
            <div className="relative mt-1 mb-0">
                <input
                type={hide ? 'password' : 'text'}
                className="form-control"
                onChange={(e) => setPassword(e)}
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setHide(!hide)}>
                <svg
                    className="h-[17px] w-[17px] text-[#707070]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                </svg>
                </span>
            </div> */}
        </> 
    );
}

export default Password;