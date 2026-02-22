/**
 * Master API URLs - From Project B (gjko.txt)
 * Base URL: ${NEXT_PUBLIC_PROJECT_PREFIX}/bfe/web/
 */

export const UserUrls = {
  LOGIN: "auth/api/user-mngmnt/v2/login",
  ENTERPRISE_BACKEND_LOGIN: "epb/api/enterprise-portal-backend/user/v2/login",
  SEND_OTP: "epb/api/enterprise-portal-backend/user/v3/send-otp",
  RE_SEND_OTP: "userm/api/user-mngmnt/v2/resend-otp",
  VERIFY_LOGIN_OTP: "auth/api/user-mngmnt/v3/verify-login-otp",
  /** UMS2 variant */
  UMS2_LOGIN: "uauth/api/uma/login",
  UMS2_SEND_OTP: "uma/api/uma/send-login-otp",
  UMS2_RE_SEND_OTP: "uma/api/uma/send-otp",
  UMS2_VERIFY_LOGIN_OTP: "uauth/api/uma/verify-login-otp",
} as const;

export const ConfigurationUrls = {
  CONFIG: "epb/api/enterprise-portal-backend/resource/v1/configuration",
  LOCALE: "epb/api/enterprise-portal-backend/resource/v1/fetch-locale-labels",
} as const;
