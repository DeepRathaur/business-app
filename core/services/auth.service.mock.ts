/**
 * Mock Auth Service - For development when no backend is available
 * Simulates Project B login flow: login → send OTP → verify OTP → token
 * Enable via NEXT_PUBLIC_MOCK_AUTH=true
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

const MOCK_SECRET = "mock-secret-key";
const MOCK_OTP = "123456";
const MOCK_TOKEN = "Bearer mock-jwt-token-" + Date.now();

export class AuthServiceMock {
  private otpStore: Map<string, { otpId: string }> = new Map();

  async login(input: LoginRequest): Promise<LoginResponse> {
    await delay(500);
    return {
      statusCode: ResponseCode.LOGIN_SUCCESS,
      message: "Login successful",
      result: { secretKey: MOCK_SECRET },
    };
  }

  async sendOtp(input: SendOtpRequest): Promise<SendOtpResponse> {
    await delay(400);
    const otpId = `otp-${Date.now()}`;
    this.otpStore.set(input.username, { otpId });
    return {
      statusCode: ResponseCode.SUCCESS,
      message: "OTP sent successfully",
      result: { otpId },
    };
  }

  async verifyOtp(input: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    await delay(400);
    if (input.otp === MOCK_OTP || input.otp.length === 6) {
      return {
        statusCode: ResponseCode.SUCCESS,
        message: "OTP verified",
        result: {
          accessToken: `mock-jwt-token-${Date.now()}`,
          tokenType: "Bearer",
        },
      };
    }
    return {
      statusCode: ResponseCode.INVALID_OTP,
      message: "Invalid OTP",
    };
  }

  async resendOtp(input: ResendOtpRequest): Promise<SendOtpResponse> {
    await delay(400);
    const otpId = `otp-${Date.now()}`;
    this.otpStore.set(input.username, { otpId });
    return {
      statusCode: ResponseCode.SUCCESS,
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
