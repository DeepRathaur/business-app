/**
 * Mock Auth Service - For development when no backend is available
 * Simulates Project B login flow: login → send OTP → verify OTP → token
 * Enable via NEXT_PUBLIC_MOCK_AUTH=true
 *
 * Real API logic (login URL/body, sendOtp, resendOtp, verifyOtp) lives in auth.service.ts:
 * - Login: encrypted → ENTERPRISE_BACKEND_LOGIN; UMS2 → UMS2_LOGIN; else LOGIN
 * - Send OTP / Resend: UMS2_SEND_OTP vs SEND_OTP, UMS2 resend vs RE_SEND_OTP
 * - Verify OTP: UMS2_VERIFY_LOGIN_OTP vs VERIFY_LOGIN_OTP
 */

import type {
  LoginRequest,
  LoginResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
} from "@/core/models/auth.models";
import { ResponseCode } from "@/core/models/auth.models";
import { ResponseCodeEnum } from "../enum/response-code.enum";

const MOCK_SECRET = "mock-secret-key";
const MOCK_OTP = "123456";
const MOCK_TOKEN = "Bearer mock-jwt-token-" + Date.now();

export class AuthServiceMock {
  private otpStore: Map<string, { otpId: string }> = new Map();

  /** Mirrors real login flow (auth.service): encrypted vs UMS2 vs standard; returns secretKey for OTP step */
  async login(
    input: LoginRequest | { record: string },
    _options?: { isEncrypted?: boolean; enableUms2?: boolean }
  ): Promise<LoginResponse> {

    console.log("Mock login called with:", input);
    await delay(500);
    return {
      statusCode: ResponseCodeEnum.LOGIN_SUCCESS,
      message: "Login successful",
      result: { secretKey: MOCK_SECRET },
    };
  }

  async sendOtp(
    input: SendOtpRequest,
    _options?: { enableUms2?: boolean }
  ): Promise<SendOtpResponse> {
    await delay(400);
    const otpId = `otp-${Date.now()}`;
    this.otpStore.set(input.username, { otpId });
    return {
      statusCode: ResponseCodeEnum.SUCCESS,
      message: "OTP sent successfully",
      result: { otpId },
    };
  }

  async verifyOtp(
    input: VerifyOtpRequest,
    _options?: { enableUms2?: boolean }
  ): Promise<VerifyOtpResponse> {
    await delay(400);
    if (input.otp === MOCK_OTP || input.otp.length === 6) {
      return {
        statusCode: ResponseCodeEnum.SUCCESS,
        message: "OTP verified",
        result: {
          accessToken: `mock-jwt-token-${Date.now()}`,
          tokenType: "Bearer",
        },
      };
    }
    return {
      statusCode: ResponseCodeEnum.INVALID_OTP,
      message: "Invalid OTP",
    };
  }

  async resendOtp(
    input: ResendOtpRequest,
    _options?: { enableUms2?: boolean }
  ): Promise<SendOtpResponse> {
    await delay(400);
    const otpId = `otp-${Date.now()}`;
    this.otpStore.set(input.username, { otpId });
    return {
      statusCode: ResponseCodeEnum.SUCCESS,
      message: "OTP resent",
      result: { otpId },
    };
  }

  buildToken(result: VerifyOtpResponse["result"]): string | null {
    if (!result?.accessToken) return null;
    const type = result.tokenType ?? "Bearer";
    return `${type} ${result.accessToken}`;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
