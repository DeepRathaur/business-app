"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthService } from "@/core/services/auth.service.factory";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useLocale } from "@/context/LocaleContext";
import { ResponseCode } from "@/core/models/auth.models";
import { validateEmail, validatePassword } from "@/shared/utils/validation";
import type { OtpEvent } from "./CustomOtpBoxes";

const DEFAULT_OTP_LENGTH = 6;
const DEFAULT_OTP_EXPIRY_MINUTES = 1;

export interface LoginFormErrors {
  email?: string;
  password?: string;
  otp?: string;
}

/**
 * useLoginFlow - Hook for login + OTP flow
 * Encapsulates: validation, API calls, token handling, navigation
 */
export function useLoginFlow() {
  const router = useRouter();
  const { login: setAuth } = useAuth();
  const { showToast } = useToast();
  const { t } = useLocale();
  const authService = getAuthService();

  const [form, setForm] = useState({
    email: "",
    password: "",
    otp: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [secretKey, setSecretKey] = useState<string>("");
  const [otpId, setOtpId] = useState<string>("");
  const [otpExpiryMinutes, setOtpExpiryMinutes] = useState(DEFAULT_OTP_EXPIRY_MINUTES);

  const clearErrors = useCallback(() => setErrors({}), []);

  const validateCredentials = useCallback((): boolean => {
    const emailKey = validateEmail(form.email);
    const passKey = validatePassword(form.password);
    const next: LoginFormErrors = {};
    if (emailKey) next.email = t(emailKey);
    if (passKey) next.password = t(passKey);
    setErrors(next);
    return !emailKey && !passKey;
  }, [form.email, form.password, t]);

  const performLogin = useCallback(async () => {
    if (!validateCredentials()) return;

    setLoading(true);
    clearErrors();
    try {
      const res = await authService.login({
        username: form.email,
        password: form.password,
      });

      const code = res.statusCode;

      if (code === ResponseCode.LOGIN_SUCCESS || code === ResponseCode.UMS2_LOGIN_SUCCESS) {
        const key = res.result?.secretKey ?? "";
        setSecretKey(key);

        const sendRes = await authService.sendOtp({
          communicationType: "EMAIL",
          username: form.email.toLowerCase().trim(),
          secretKey: key,
        });

        if (sendRes.statusCode === ResponseCode.SUCCESS) {
          setOtpId(sendRes.result?.otpId ?? "");
          setOtpStep(true);
          showToast(sendRes.message ?? t("message_constant.OTP_SENT_SUCCESS"), "success");
        } else {
          const msg = sendRes.message ?? t("message_constant.SOMETHING_WENT_WRONG");
          setErrors({ password: msg });
          showToast(msg, "error");
        }
      } else if (
        code === ResponseCode.INCORRECT_USERNAME_PASSWORD ||
        code === ResponseCode.INCORRECT_USERNAME
      ) {
        const msg = res.message ?? t("message_constant.INCORRECT_USERNAME_PASSWORD");
        setErrors({ password: msg });
        showToast(msg, "error");
      } else {
        const msg = res.message ?? t("message_constant.SOMETHING_WENT_WRONG");
        setErrors({ password: msg });
        showToast(msg, "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("message_constant.SOMETHING_WENT_WRONG");
      setErrors({ password: msg });
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [form.email, form.password, validateCredentials, clearErrors, authService, showToast, t]);

  const handleOtpEvent = useCallback(
    (event: OtpEvent) => {
      if (event.actionType === "SEND_OTP") {
        setForm((f) => ({ ...f, otp: event.otp }));
      } else if (event.actionType === "RE_SEND_OTP") {
        setLoading(true);
        authService
          .resendOtp({
            communicationType: "EMAIL",
            username: form.email.toLowerCase().trim(),
            otpId,
          })
          .then((res) => {
            if (res.statusCode === ResponseCode.SUCCESS) {
              setOtpId(res.result?.otpId ?? otpId);
              setOtpExpiryMinutes(DEFAULT_OTP_EXPIRY_MINUTES);
              showToast(t("message_constant.OTP_RESEND_SUCCESS"), "success");
            } else {
              showToast(t("message_constant.OTP_RESEND_FAILED"), "error");
            }
          })
          .finally(() => setLoading(false));
      }
    },
    [form.email, otpId, authService, showToast, t]
  );

  const verifyOtp = useCallback(async () => {
    if (form.otp.length !== DEFAULT_OTP_LENGTH) {
      setErrors({ otp: t("message_constant.INVALID_OTP") });
      return;
    }

    setLoading(true);
    clearErrors();
    try {
      const res = await authService.verifyOtp({
        otp: form.otp,
        otpId,
        username: form.email.toLowerCase().trim(),
        secretKey,
      });

      if (res.statusCode === ResponseCode.SUCCESS) {
        const token = authService.buildToken(res.result);
        if (token) {
          setAuth(token);
          showToast(res.message ?? t("message_constant.SUCCESS"), "success");
          router.push("/dashboard");
        } else {
          setErrors({ otp: t("message_constant.SOMETHING_WENT_WRONG") });
        }
      } else {
        const msg = res.message ?? t("message_constant.INVALID_OTP");
        setErrors({ otp: msg });
        showToast(msg, "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("message_constant.SOMETHING_WENT_WRONG");
      setErrors({ otp: msg });
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [
    form.otp,
    form.email,
    otpId,
    secretKey,
    authService,
    setAuth,
    router,
    clearErrors,
    showToast,
    t,
  ]);

  const goBack = useCallback(() => {
    setOtpStep(false);
    setForm((f) => ({ ...f, otp: "" }));
    clearErrors();
  }, [clearErrors]);

  return {
    form,
    setForm,
    errors,
    loading,
    otpStep,
    otpLength: DEFAULT_OTP_LENGTH,
    otpExpiryMinutes,
    performLogin,
    handleOtpEvent,
    verifyOtp,
    goBack,
    clearErrors,
  };
}
