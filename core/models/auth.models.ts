/**
 * Auth Models - DTOs for login flow
 * Typed interfaces for request/response. No business logic.
 */

/** Login request payload */
export interface LoginRequest {
  username: string;
  password: string;
}

/** Login response - API returns secretKey for OTP flow */
export interface LoginResponse {
  statusCode: string;
  message?: string;
  result?: {
    secretKey?: string;
    subscribers?: unknown[];
  };
}

/** Send OTP request */
export interface SendOtpRequest {
  communicationType: "EMAIL";
  username: string;
  secretKey: string;
}

/** Send OTP / Resend OTP response */
export interface SendOtpResponse {
  statusCode: string;
  message?: string;
  result?: {
    otpId?: string;
  };
}

/** Verify OTP request */
export interface VerifyOtpRequest {
  otp: string;
  otpId: string;
  username: string;
  secretKey: string;
}

/** Resend OTP request */
export interface ResendOtpRequest {
  communicationType: "EMAIL";
  username: string;
  otpId?: string;
}

/** Verify OTP response - contains access token */
export interface VerifyOtpResponse {
  statusCode: string;
  message?: string;
  result?: {
    accessToken?: string;
    tokenType?: string;
  };
}

/** Response code enum for consistent handling */
export const ResponseCode = {
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  UMS2_LOGIN_SUCCESS: "UMS2_LOGIN_SUCCESS",
  INCORRECT_USERNAME_PASSWORD: "INCORRECT_USERNAME_PASSWORD",
  INCORRECT_USERNAME: "INCORRECT_USERNAME",
  FAILED_TO_AUTHENTICATE: "FAILED_TO_AUTHENTICATE",
  AUTH_FAILED: "AUTH_FAILED",
  FAILE: "FAILE",
  SECRET_KEY_USED: "SECRET_KEY_USED",
  SECRET_KEY_EXPIRED: "SECRET_KEY_EXPIRED",
  SUCCESS: "SUCCESS",
  INVALID_OTP: "INVALID_OTP",
  UMS2_INVALID_OTP: "UMS2_INVALID_OTP",
  VERIFY_OTP_FAIL: "VERIFY_OTP_FAIL",
  UMS2_OTP_EXPIRED: "UMS2_OTP_EXPIRED",
  UMS2_DOWNSTREAM_ISSUE: "UMS2_DOWNSTREAM_ISSUE",
} as const;

export type ResponseCodeType = (typeof ResponseCode)[keyof typeof ResponseCode];
