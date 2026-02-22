/**
 * Request Interceptor - Adds BFE headers, auth, request metadata
 * Mirrors interceptors.txt client fetch. Works in browser and Capacitor WebView.
 */

import { accountService } from "@/core/services/account.service";
import { getOS } from "@/core/utils/device";

const isProd = process.env.NEXT_PUBLIC_IS_PROD === "true";

export interface RequestInterceptorOptions {
  /** Skip auth header (e.g. login, public endpoints) */
  skipAuth?: boolean;
  /** Custom headers to merge (will override defaults for same keys) */
  headers?: Record<string, string>;
}

/**
 * Builds BFE + metadata headers for API requests
 */
export function buildRequestHeaders(options: RequestInterceptorOptions = {}): Record<string, string> {
  const { skipAuth = false, headers: custom = {} } = options;

  const headers: Record<string, string> = {
    "opco": process.env.NEXT_PUBLIC_OPCO ?? "",
    "product": process.env.NEXT_PUBLIC_PRODUCT ?? "ENTERPRISE_PORTAL",
    "requestDate": Date.now().toString(),
    "requestId": Math.random().toString(36).substring(2, 12),
    "x-device-type": getOS(),
    "Accept-Encoding": "identity",
    "Content-Type": "application/json",
    ...custom,
  };

  // BFE headers - prod vs UAT
  if (isProd) {
    headers["x-api-key"] = process.env.NEXT_PUBLIC_BFE_PROD_BFE_A_K ?? "";
    headers["x-service-id"] = process.env.NEXT_PUBLIC_BFE_PROD_SERVICE_ID ?? "";
    headers["x-app-version"] = process.env.NEXT_PUBLIC_BFE_PROD_X_APP_VERSION ?? "1.0.0";
    headers["x-client-id"] = process.env.NEXT_PUBLIC_BFE_PROD_X_CLIENT_ID ?? "";
    headers["x-group-code"] = process.env.NEXT_PUBLIC_BFE_PROD_X_GROUP_CODE ?? "";
    headers["x-channel-code"] = process.env.NEXT_PUBLIC_BFE_PROD_X_CHANNEL_CODE ?? "";
  } else {
    headers["x-api-key"] = process.env.NEXT_PUBLIC_BFE_UAT_BFE_A_K ?? "";
    headers["x-service-id"] = process.env.NEXT_PUBLIC_BFE_UAT_SERVICE_ID ?? "";
    headers["x-app-version"] = process.env.NEXT_PUBLIC_BFE_UAT_X_APP_VERSION ?? "1.0.0";
    headers["x-client-id"] = process.env.NEXT_PUBLIC_BFE_UAT_X_CLIENT_ID ?? "";
    headers["x-group-code"] = process.env.NEXT_PUBLIC_BFE_UAT_X_GROUP_CODE ?? "";
    headers["x-channel-code"] = process.env.NEXT_PUBLIC_BFE_UAT_X_CHANNEL_CODE ?? "";
  }

  // Auth - only on client, only when not skipped
  if (!skipAuth && typeof window !== "undefined") {
    const token = accountService.getAccessToken();
    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }
  }

  return headers;
}
