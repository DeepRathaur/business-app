"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Image from "next/image";
import MobileContainer from "@/components/ui/MobileContainer";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";
import { useLocale } from "@/context/LocaleContext";
import { LoginForm, OTPVerification, useLoginFlow } from "@/features/auth/login";
import { LanguageSheet } from "./LanguageSheet";

const AnimatedLogo = dynamic(
  () => import("@/components/animations/AnimatedLogo").then((m) => m.default),
  { ssr: false, loading: () => <div className="h-12 w-32 bg-neutral-200 rounded-md animate-pulse" /> }
);

const QuickActions = dynamic(() => import("./QuickActions").then((m) => m.default), {
  ssr: false,
  loading: () => null,
});

/**
 * Login Page - Optimized: dynamic AnimatedLogo, PageTransitionWrapper, QuickActions; CSS-only language sheet.
 */
export default function LoginPage() {
  const { currentLanguage, changeLanguage } = useLocale();
  const {
    form,
    setForm,
    errors,
    loading,
    otpStep,
    otpLength,
    otpExpiryMinutes,
    performLogin,
    handleOtpEvent,
    verifyOtp,
    goBack,
  } = useLoginFlow();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const languages = ["en", "fr"];

  return (
    <MobileContainer scroll>
      <SafeAreaWrapper>
        <PageTransitionWrapper>
          <div className="min-h-[100dvh] bg-neutral-50 flex flex-col px-5 py-6">
            {!otpStep ? (
              <>
                <div className="flex justify-end space-x-1 ml-2">
                  <Image src="/images/icons/Icon ionic-md-globe.svg" alt="Language" width={15} height={15} />
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(true)}
                    className="flex items-center text-sm text-black focus:outline-none"
                  >
                    {currentLanguage.toUpperCase()}
                    <Image
                      src="/images/icons/down-arrow.svg"
                      alt="Dropdown"
                      width={20}
                      height={20}
                      className="ml-1"
                    />
                  </button>
                </div>

                <div className="pt-6 flex justify-center mb-8">
                  <AnimatedLogo size="sm" variant="login" />
                </div>

                <LoginForm
                  email={form.email}
                  password={form.password}
                  errors={errors}
                  loading={loading}
                  onEmailChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  onPasswordChange={(v) => setForm((f) => ({ ...f, password: v }))}
                  onSubmit={performLogin}
                />

                <QuickActions />

                <LanguageSheet
                  open={dropdownOpen}
                  onClose={() => setDropdownOpen(false)}
                  currentLanguage={currentLanguage}
                  changeLanguage={changeLanguage}
                  languages={languages}
                />
              </>
            ) : (
              <OTPVerification
                email={form.email}
                otpLength={otpLength}
                otpExpiryMinutes={otpExpiryMinutes}
                error={errors.otp}
                loading={loading}
                onOtpEvent={handleOtpEvent}
                onVerify={verifyOtp}
                onBack={goBack}
              />
            )}
          </div>
        </PageTransitionWrapper>
      </SafeAreaWrapper>
    </MobileContainer>
  );
}
