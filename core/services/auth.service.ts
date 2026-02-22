/**
 * Auth Service - Business logic layer
 * Uses master URLs. Supports UMS2 when enabled via Global Config.
 */

import { httpClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/api/config";
import { getGlobalConfig } from "@/core/config/globalConfig";
import type {
  LoginRequest,
  LoginResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResendOtpRequest,
} from "@/core/models/auth.models";

export type AuthServiceConfig = {
  enableUms2?: boolean;
};

export class AuthService {
  private config: AuthServiceConfig;

  constructor(config: AuthServiceConfig = {}) {
    this.config = config;
  }

  private get enableUms2(): boolean {
    return this.config.enableUms2 ?? getGlobalConfig().enableUms2;
  }

  private get loginUrl(): string {
    return this.enableUms2 ? API_ENDPOINTS.UMS2_LOGIN : API_ENDPOINTS.LOGIN;
  }

  private get sendOtpUrl(): string {
    return this.enableUms2 ? API_ENDPOINTS.UMS2_SEND_OTP : API_ENDPOINTS.SEND_OTP;
  }

  private get verifyOtpUrl(): string {
    return this.enableUms2 ? API_ENDPOINTS.UMS2_VERIFY_OTP : API_ENDPOINTS.VERIFY_OTP;
  }

  private get resendOtpUrl(): string {
    return this.enableUms2 ? API_ENDPOINTS.UMS2_RESEND_OTP : API_ENDPOINTS.RESEND_OTP;
  }

  async login(input: LoginRequest): Promise<LoginResponse> {
    const body = {
      username: input.username.toLowerCase().trim(),
      password: input.password,
    };
    return httpClient<LoginResponse>(this.loginUrl, {
      method: "POST",
      body,
      skipAuth: true,
    });
  }

  async sendOtp(input: SendOtpRequest): Promise<SendOtpResponse> {
    return httpClient<SendOtpResponse>(this.sendOtpUrl, {
      method: "POST",
      body: input,
      skipAuth: true,
    });
  }

  async verifyOtp(input: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    return httpClient<VerifyOtpResponse>(this.verifyOtpUrl, {
      method: "POST",
      body: input,
      skipAuth: true,
    });
  }

  async resendOtp(input: ResendOtpRequest): Promise<SendOtpResponse> {
    return httpClient<SendOtpResponse>(this.resendOtpUrl, {
      method: "POST",
      body: input,
      skipAuth: true,
    });
  }

  buildToken(result: VerifyOtpResponse["result"]): string | null {
    if (!result?.accessToken) return null;
    const type = result.tokenType ?? "Bearer";
    return `${type} ${result.accessToken}`;
  }
}
