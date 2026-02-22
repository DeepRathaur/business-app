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

export type AuthCallOptions = {
  enableUms2?: boolean;
};

export class AuthService {
  private config: AuthServiceConfig;

  constructor(config: AuthServiceConfig = {}) {
    this.config = config;
  }

  private getEnableUms2(override?: boolean): boolean {
    return override ?? this.config.enableUms2 ?? getGlobalConfig().enableUms2;
  }

  private get loginUrl(): string {
    return this.getEnableUms2() ? API_ENDPOINTS.UMS2_LOGIN : API_ENDPOINTS.LOGIN;
  }

  private getUrl(overrideUms2: boolean | undefined, ums2Path: string, stdPath: string): string {
    return this.getEnableUms2(overrideUms2) ? ums2Path : stdPath;
  }

  async login(
    input: LoginRequest | { record: string },
    options?: { isEncrypted?: boolean; enableUms2?: boolean }
  ): Promise<LoginResponse> {
    const enableUms2 = this.getEnableUms2(options?.enableUms2);
    const url = this.getUrl(options?.enableUms2, API_ENDPOINTS.UMS2_LOGIN, API_ENDPOINTS.LOGIN);
    const body =
      options?.isEncrypted && "record" in input
        ? input
        : {
            username: (input as LoginRequest).username.toLowerCase().trim(),
            password: (input as LoginRequest).password,
          };
    return httpClient<LoginResponse>(url, {
      method: "POST",
      body,
      skipAuth: true,
    });
  }

  async sendOtp(input: SendOtpRequest, options?: AuthCallOptions): Promise<SendOtpResponse> {
    const url = this.getUrl(options?.enableUms2, API_ENDPOINTS.UMS2_SEND_OTP, API_ENDPOINTS.SEND_OTP);
    return httpClient<SendOtpResponse>(url, {
      method: "POST",
      body: input,
      skipAuth: true,
    });
  }

  async verifyOtp(input: VerifyOtpRequest, options?: AuthCallOptions): Promise<VerifyOtpResponse> {
    const url = this.getUrl(options?.enableUms2, API_ENDPOINTS.UMS2_VERIFY_OTP, API_ENDPOINTS.VERIFY_OTP);
    return httpClient<VerifyOtpResponse>(url, {
      method: "POST",
      body: input,
      skipAuth: true,
    });
  }

  async resendOtp(input: ResendOtpRequest, options?: AuthCallOptions): Promise<SendOtpResponse> {
    const url = this.getUrl(options?.enableUms2, API_ENDPOINTS.UMS2_RESEND_OTP, API_ENDPOINTS.RESEND_OTP);
    return httpClient<SendOtpResponse>(url, {
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
