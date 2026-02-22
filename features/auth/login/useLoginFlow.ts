"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthService } from "@/core/services/auth.service.factory";
import { CryptoService } from "@/core/services/crypto.service";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useLocale } from "@/context/LocaleContext";
import { useConfig } from "@/context/ConfigContext";
import { useLayout } from "@/context/LayoutContext";
import { ResponseCode } from "@/core/models/auth.models";
import type { OtpEvent } from "./CustomOtpBoxes";

const DEFAULT_OTP_LENGTH = 6;
const DEFAULT_OTP_EXPIRY_MINUTES = 1;

export interface LoginFormErrors {
  email?: string;
  password?: string;
  otp?: string;
}

/**
 * useLoginFlow - Enterprise login + OTP flow
 * Encapsulates: validate, login, performLogin, sendOtp, verifyOtp, resendOtp
 * Uses: ConfigContext (UMS2, encryption, OTP config), CryptoService, AuthService
 */
export function useLoginFlow() {
  const router = useRouter();
  const { login: loginAuth } = useAuth();
  const { showToast } = useToast();
  const { t } = useLocale();
  const { setHideHeader } = useLayout();
  const config = useConfig();
  const authService = getAuthService();
  const cipher = useMemo(() => new CryptoService(), []);

  const isEncrypted = config.isEncrypted;
  const isEnableUms2 = config.isEnableUms2;
  const otpLength = config.otpLength ?? DEFAULT_OTP_LENGTH;
  const otpExpiryMinutes = config.otpExpiryMinutes ?? DEFAULT_OTP_EXPIRY_MINUTES;
  const emailPattern = config.emailPattern;

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

  const clearErrors = useCallback(() => setErrors({}), []);

  const validateEmail = useCallback(
    (email: string): boolean => emailPattern.test(email.trim()),
    [emailPattern]
  );

  const passwordMinLength = config.validation?.passwordMinLength;
  const passwordPattern = config.pattern?.VALID_PASSWORD
    ? new RegExp(config.pattern.VALID_PASSWORD)
    : null;

  const validateCredentials = useCallback((): boolean => {
    const next: LoginFormErrors = {};
    if (!form.email?.trim()) {
      next.email = t("ErrorMesaage.REQUIRED");
    } else if (!validateEmail(form.email)) {
      next.email = t("ErrorMesaage.EMAIL");
    }
    if (!form.password) {
      next.password = t("ErrorMesaage.REQUIRED");
    } else if (
      typeof passwordMinLength === "number" &&
      form.password.length < passwordMinLength
    ) {
      next.password = t("USER_REGISTRATION.LOGIN_PASSWORD_MIN_LENGTH_TXT");
    } else if (passwordPattern && !passwordPattern.test(form.password)) {
      next.password = t("USER_REGISTRATION.LOGIN_PASSWORD_MIN_LENGTH_TXT");
    }
    setErrors(next);
    return !next.email && !next.password;
  }, [
    form.email,
    form.password,
    validateEmail,
    passwordMinLength,
    passwordPattern,
    t,
  ]);

  const sendOtp = useCallback(
    async (key: string) => {
      setLoading(true);
      clearErrors();
      try {
        const sendRes = await authService.sendOtp(
          {
            communicationType: "EMAIL",
            username: form.email.toLowerCase().trim(),
            secretKey: key,
          },
          { enableUms2: isEnableUms2 }
        );
        if (sendRes.statusCode === ResponseCode.SUCCESS) {
          setOtpId(sendRes.result?.otpId ?? "");
          setOtpStep(true);
          setHideHeader(true);
          showToast(sendRes.message ?? t("message_constant.OTP_SENT_SUCCESS"), "success");
        } else {
          showToast(sendRes.message ?? t("message_constant.SOMETHING_WENT_WRONG"), "error");
          setErrors({ password: sendRes.message ?? t("message_constant.SOMETHING_WENT_WRONG") });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        showToast(t("message_constant.SOMETHING_WENT_WRONG"), "error");
        setErrors({ password: t("message_constant.SOMETHING_WENT_WRONG") });
      } finally {
        setLoading(false);
      }
    },
    [form.email, authService, isEnableUms2, showToast, t, setHideHeader, clearErrors]
  );

  const performLogin = useCallback(
    async (input: { username: string; password: string } | string) => {
      
      setLoading(true);
      clearErrors();
      try {
        const body =
          typeof input === "string"
            ? { record: input }
            : {
                username: input.username.toLowerCase().trim(),
                password: input.password,
              };

        const res = await authService.login(body as { username: string; password: string } | { record: string }, {
          isEncrypted: typeof input === "string",
          enableUms2: isEnableUms2,
        });

        const code = res.statusCode;

        if (code === ResponseCode.LOGIN_SUCCESS || code === ResponseCode.UMS2_LOGIN_SUCCESS) {
          const key = res.result?.secretKey ?? "";
          setSecretKey(key);
          setErrors({});
          await sendOtp(key);
        } else if (
          code === ResponseCode.INCORRECT_USERNAME_PASSWORD ||
          code === ResponseCode.INCORRECT_USERNAME
        ) {
          setErrors({ password: res.message ?? t("message_constant.INCORRECT_USERNAME_PASSWORD") });
          showToast(res.message ?? t("message_constant.INCORRECT_USERNAME_PASSWORD"), "error");
        } else if (
          code === ResponseCode.FAILED_TO_AUTHENTICATE ||
          code === ResponseCode.AUTH_FAILED
        ) {
          showToast(res.message ?? t("message_constant.SOMETHING_WENT_WRONG"), "error");
        } else if (code === ResponseCode.FAILE || code === ResponseCode.SECRET_KEY_USED) {
          showToast(res.message ?? t("message_constant.SOMETHING_WENT_WRONG"), "error");
        } else {
          showToast(res.message ?? t("message_constant.SOMETHING_WENT_WRONG"), "error");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : t("message_constant.SOMETHING_WENT_WRONG");
        setErrors({ password: msg });
        showToast(msg, "error");
      } finally {
        setLoading(false);
      }
    },
    [authService, isEnableUms2, sendOtp, showToast, t, clearErrors]
  );

  const login = useCallback(
    async (input: { username: string; password: string }) => {
      if (isEncrypted) {
        cipher
          .encrypt(JSON.stringify(input))
          .then((encrypted) => performLogin(encrypted))
          .catch(() => {
            showToast(t("message_constant.SOMETHING_WENT_WRONG"), "error");
            setLoading(false);
          });
      } else {
        await performLogin(input);
      }
    },
    [isEncrypted, cipher, performLogin, showToast, t]
  );

  const handlePerformLogin = useCallback(() => {
    if (!validateCredentials()) return;
    const input = {
      username: form.email.toLowerCase().trim(),
      password: form.password,
    };
    login(input);
  }, [form.email, form.password, validateCredentials, login]);

  const handleOtpEvent = useCallback(
    (event: OtpEvent) => {
      if (event.actionType === "SEND_OTP") {
        const otp =
          event.otp && event.otp.length === otpLength ? event.otp : "";
        setForm((f) => ({ ...f, otp }));
      } else if (event.actionType === "RE_SEND_OTP") {
        handleResendOtp();
      }
    },
    [otpLength]
  );

  const handleResendOtp = useCallback(async () => {
    if (errors.email || errors.password) return;

    setLoading(true);
    clearErrors();
    try {
      const input: { communicationType: "EMAIL"; username: string; otpId?: string } = {
        communicationType: "EMAIL",
        username: form.email.toLowerCase().trim(),
      };
      if (!config.opcoConfig?.ENABLE_UMS_2) {
        input.otpId = otpId;
      }
      const res = await authService.resendOtp(input, {
        enableUms2: isEnableUms2,
      });

      if (res.statusCode === ResponseCode.SUCCESS) {
        setOtpId(res.result?.otpId ?? otpId);
        showToast(t("message_constant.OTP_RESEND_SUCCESS"), "success");
      } else {
        showToast(t("message_constant.OTP_RESEND_FAILED"), "error");
      }
    } catch {
      setErrors({ password: t("message_constant.SOMETHING_WENT_WRONG") });
      showToast(t("message_constant.OTP_RESEND_FAILED"), "error");
    } finally {
      setLoading(false);
    }
  }, [
    form.email,
    otpId,
    config.opcoConfig?.ENABLE_UMS_2,
    isEnableUms2,
    authService,
    errors.email,
    errors.password,
    showToast,
    t,
    clearErrors,
  ]);

  const verifyOtp = useCallback(async () => {
    if (form.otp.length !== otpLength) {
      setErrors({ otp: t("message_constant.INVALID_OTP") });
      return;
    }

    setLoading(true);
    clearErrors();
    try {
      const res = await authService.verifyOtp(
        {
          otp: form.otp,
          otpId,
          username: form.email.toLowerCase().trim(),
          secretKey,
        },
        { enableUms2: isEnableUms2 }
      );

      if (res.statusCode === ResponseCode.SUCCESS) {
        const token = authService.buildToken(res.result);
        if (token) {
          loginAuth(token);
          setHideHeader(true);
          showToast(res.message ?? t("message_constant.SUCCESS"), "success");
          router.push("/fetch-permission");
        } else {
          setErrors({ otp: t("message_constant.SOMETHING_WENT_WRONG") });
        }
      } else if (
        res.statusCode === ResponseCode.INVALID_OTP ||
        res.statusCode === ResponseCode.UMS2_INVALID_OTP ||
        res.statusCode === ResponseCode.VERIFY_OTP_FAIL ||
        res.statusCode === ResponseCode.UMS2_OTP_EXPIRED ||
        res.statusCode === ResponseCode.SECRET_KEY_EXPIRED ||
        res.statusCode === ResponseCode.UMS2_DOWNSTREAM_ISSUE
      ) {
        showToast(res.message ?? t("message_constant.SOMETHING_WENT_WRONG"), "error");
        setErrors({ otp: res.message ?? t("message_constant.INVALID_OTP") });
      } else {
        showToast(res.message ?? t("message_constant.SOMETHING_WENT_WRONG"), "error");
        setErrors({ otp: res.message ?? t("message_constant.INVALID_OTP") });
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
    otpLength,
    isEnableUms2,
    authService,
    loginAuth,
    router,
    setHideHeader,
    showToast,
    t,
    clearErrors,
  ]);

  const goBack = useCallback(() => {
    setOtpStep(false);
    setForm((f) => ({ ...f, otp: "" }));
    setHideHeader(false);
    clearErrors();
  }, [clearErrors, setHideHeader]);

  return {
    form,
    setForm,
    errors,
    loading,
    otpStep,
    otpLength,
    otpExpiryMinutes,
    performLogin: handlePerformLogin,
    handleOtpEvent,
    verifyOtp,
    goBack,
    clearErrors,
  };
}
