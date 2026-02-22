"use client";

import Link from "next/link";
import MobileContainer from "@/components/ui/MobileContainer";
import SafeAreaWrapper from "@/components/ui/SafeAreaWrapper";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AnimatedLogo from "@/components/animations/AnimatedLogo";
import PageTransitionWrapper from "@/components/animations/PageTransitionWrapper";
import { useLocale } from "@/context/LocaleContext";
import { LoginForm, OTPVerification, useLoginFlow } from "@/features/auth/login";
import Image from 'next/image';
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import QuickActions from "./QuickActions";

/**
 * Login Page - Clean architecture integration
 * Flow: Email+Password → Validate & Get OTP → OTP Verification → Dashboard
 * Uses: core/api, core/services, core/models, shared/utils, features/auth/login
 */
export default function LoginPage() {
  const { t, currentLanguage, changeLanguage } = useLocale();
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
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const languages = ['en', 'fr'];

  return (
    <MobileContainer scroll>
      <SafeAreaWrapper>
        <PageTransitionWrapper>
          <div className="min-h-[100dvh] bg-neutral-50 flex flex-col px-5 py-6">
            {!otpStep ? (
              <>
                {/* Language selector - top right */}
                {/* Language Selector */}
                <div className="flex justify-end space-x-1 ml-2">
                  <Image src="/images/icons/Icon ionic-md-globe.svg" alt="Language" width={15} height={15} />
                  <button
                    onClick={toggleDropdown}
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


                {/* Logo - centered */}
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
                {/* Bottom Sheet Dropdown */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      key="overlay"
                      className="fixed inset-0 z-50 flex items-end justify-center bg-custom-overlay bg-opacity-40"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => setDropdownOpen(false)} // tap outside to close
                    >

                      {/* Bottom Sheet */}
                      <motion.div
                        key="sheet"
                        onClick={(e) => e.stopPropagation()} // prevent closing when tapping inside
                        className="w-full bg-white rounded-t-[18px] shadow-lg p-4"
                        initial={{
                          y: "100%",
                          opacity: 0,
                          backgroundColor: "rgba(255,255,255,0)"
                        }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          backgroundColor: "rgba(255,255,255,1)"
                        }}
                        exit={{
                          y: "100%",
                          opacity: 0,
                          backgroundColor: "rgba(255,255,255,0)"
                        }}
                        transition={{
                          y: {
                            type: "spring",
                            stiffness: 380,
                            damping: 28,
                          },
                          opacity: { duration: 0.2 },
                          backgroundColor: { duration: 0.25 }
                        }}
                      // animate={{ y: 0 }}
                      // exit={{ y: "100%" }}
                      // transition={{
                      //   type: "spring",
                      //   stiffness: 380,
                      //   damping: 28,
                      // }}
                      >
                        {/* Close Button */}
                        <div className="flex justify-end mb-2">
                          <button
                            onClick={() => setDropdownOpen(false)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">
                          Change Language
                        </h3>

                        {/* Language Options */}
                        <div className="flex flex-col space-y-2">
                          {languages.map((lang) => (
                            <button
                              key={lang}
                              onClick={() => changeLanguage(lang)}
                              className={`text-sm py-2 rounded flex items-center space-x-2 ${currentLanguage === lang
                                ? " text-red-600 font-semibold"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                              <span className="inline-flex h-5 w-5 items-center justify-center leading-none">
                                {currentLanguage === lang && (
                                  <Image
                                    src="/images/icons/Check-mark.svg"
                                    alt="Language"
                                    decoding="async" data-nimg="1"
                                    loading="lazy"
                                    width={20}
                                    height={20}
                                  />
                                )}
                              </span>
                              <span>{lang.toUpperCase()}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
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