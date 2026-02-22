"use client";

import CustomOtpBoxes from "./CustomOtpBoxes";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { maskEmail } from "@/shared/utils/maskEmail";
import { useLocale } from "@/context/LocaleContext";
import type { OtpEvent } from "./CustomOtpBoxes";

interface OTPVerificationProps {
  email: string;
  otpLength: number;
  otpExpiryMinutes: number;
  error?: string;
  loading: boolean;
  onOtpEvent: (event: OtpEvent) => void;
  onVerify: () => void;
  onBack: () => void;
}

/**
 * OTPVerification - OTP step UI
 * Uses t() for all strings. Accessible error display.
 */
export default function OTPVerification({
  email,
  otpLength,
  otpExpiryMinutes,
  error,
  loading,
  onOtpEvent,
  onVerify,
  onBack,
}: OTPVerificationProps) {
  const { t } = useLocale();
  const masked = maskEmail(email, {
    prefix: 3,
    maskLength: 4,
    maskChar: "*",
    lowercaseDomain: true,
  });

  return (
    <>
      <div className="sticky z-[100] w-full">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 min-h-[44px]"
          aria-label={t("USER_LOGIN.BACK_TO_SIGNIN")}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="text-sm font-medium">{t("USER_LOGIN.BACK_TO_SIGNIN")}</span>
        </button>
      </div>

      <section>
        <div className="mt-6 text-center">
          <h1 className="text-sm font-semibold text-gray-800 max-[320px]:text-[16px]">
            OTP Verification
          </h1>
          <p className="mt-2 text-sm text-gray-600 max-[320px]:text-[13px] max-[300px]:text-[12px]">
            {t("USER_LOGIN.OTP_SENT_TO")}{masked}
          </p>
        </div>
      </section>


      <CustomOtpBoxes
        timer={otpExpiryMinutes}
        otpLength={otpLength}
        onOtpEvent={onOtpEvent}
        resendLabel={t("USER_LOGIN.RESEND")}
      />

      {error && (
        <p className="mt-2 text-sm text-red-500 text-center" role="alert" id="otp-error">
          {error}
        </p>
      )}

      <div className="mt-5">
        <PrimaryButton
          fullWidth
          loading={loading}
          onClick={onVerify}
          className="btn-auth-primary"
        >
          {t("BUTTONS.LOGIN")}
        </PrimaryButton>
      </div>
    </>
  );
}
