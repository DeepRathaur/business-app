import React, { ChangeEvent } from "react";
import ShowError from "../show-error/ShowError";

interface Email {
    form: {
        [key: string]: string;
    },

    errorForm: {
        [key: string]: string;
    },

    headerText: string;

    handleEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
    getErrorMessage: (key: string, value: string) => string;
    getText: (message: string) => string;
}

const Email: React.FC<Email> = ({form, errorForm, handleEmailChange, getErrorMessage, getText, headerText }) => {
    const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
        handleEmailChange(e)
    }

    return (
        <>

            <label className="block text-sm text-gray-800 font-semibold">
            {headerText}<span className="ml-1 text-red-600">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => {handleEmail(e)}}
              className="mt-2 w-full bg-transparent border-b border-gray-300 focus:border-gray-500 outline-none p-2 text-gray-800 placeholder:text-gray-400"
            />

            {/* <label className="form-label">{headerText}*</label>
            <input
                type="email"
                value={form.email}
                onChange={(e) => {handleEmail(e)}}
                className="form-control"
            /> */}
            {errorForm.email &&  <ShowError error={errorForm.email} getErrorMessage={getErrorMessage} getText={getText} /> }
            <p className="text-xs text-[#707070] mt-[5px]">
                Note: 6 digit OTP will be sent to linked email ID
            </p>
        </>
    )
}

export default Email;