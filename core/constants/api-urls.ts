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

export const UserUrls_extended = {
  FETCH_USER: "epb/api/enterprise-portal-backend/user/v1/fetch-user",
  FETCH_USER_V2: "epb/api/enterprise-portal-backend/user/v2/fetch-user",
  FETCH_UMS_DETAILS: "userm/api/user-mngmnt/users",
  UMS2_FETCH_UMS_DETAILS: "uma/api/uma/user",
} as const;

/** Master data / account / billing APIs */
export const MasterDataUrls = {
  GET_ACCOUNT_DETAILS: "epb/api/enterprise-portal-backend/account/v1/load",
  GET_BILL_SUMMARY: "epb/api/enterprise-portal-backend/account/v1/bill-summary",
  GET_BANNER_CONFIGURATION:'epb/api/enterprise-portal-backend/banner/findAll',
  SAVE_BANNER_CONFIGURATION: 'epb/api/enterprise-portal-backend/banner/log-activity',
  GET_LINE_DETAILS: "epb/api/enterprise-portal-backend/line/v1/search",
  GET_LINE_COUNT: "epb/api/enterprise-portal-backend/line/v1/line-count",
} as const;
