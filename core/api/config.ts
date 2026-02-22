/**
 * API Configuration - Uses Global Config + Master URLs
 */

import { getGlobalConfig } from "@/core/config/globalConfig";
import { UserUrls } from "@/core/constants/api-urls";

export const API_ENDPOINTS = {
  LOGIN: UserUrls.LOGIN,
  /** Encrypted login (record payload) */
  ENTERPRISE_BACKEND_LOGIN: UserUrls.ENTERPRISE_BACKEND_LOGIN,
  SEND_OTP: UserUrls.SEND_OTP,
  VERIFY_OTP: UserUrls.VERIFY_LOGIN_OTP,
  RESEND_OTP: UserUrls.RE_SEND_OTP,
  /** UMS2 variants */
  UMS2_LOGIN: UserUrls.UMS2_LOGIN,
  UMS2_SEND_OTP: UserUrls.UMS2_SEND_OTP,
  UMS2_VERIFY_OTP: UserUrls.UMS2_VERIFY_LOGIN_OTP,
  UMS2_RESEND_OTP: UserUrls.UMS2_RE_SEND_OTP,
} as const;

export function getApiBaseUrl(): string {
  return getGlobalConfig().apiBaseUrl;
}

export function getFullUrl(path: string): string {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
