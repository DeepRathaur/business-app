/**
 * Axios HTTP Client - Uses interceptors for BFE headers, auth, error handling
 * Used by ConfigurationService and LanguageService for POST requests.
 */

import axios from "axios";
import { accountService } from "@/core/services/account.service";
import { getOS } from "@/core/utils/device";
import { getApiBaseUrl } from "./config";

const isProd = process.env.NEXT_PUBLIC_IS_PROD === "true";

const axiosClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor: add BFE headers, auth
axiosClient.interceptors.request.use(
  (config) => {
    config.headers["opco"] = process.env.NEXT_PUBLIC_OPCO ?? "";
    config.headers["product"] = process.env.NEXT_PUBLIC_PRODUCT ?? "ENTERPRISE_PORTAL";
    config.headers["requestDate"] = Date.now().toString();
    config.headers["requestId"] = Math.random().toString(36).substring(2, 12);
    config.headers["x-device-type"] = getOS() ?? "";

    config.headers["x-api-key"] = isProd
      ? process.env.NEXT_PUBLIC_BFE_PROD_BFE_A_K ?? ""
      : process.env.NEXT_PUBLIC_BFE_UAT_BFE_A_K ?? "";
    config.headers["x-service-id"] = isProd
      ? process.env.NEXT_PUBLIC_BFE_PROD_SERVICE_ID ?? ""
      : process.env.NEXT_PUBLIC_BFE_UAT_SERVICE_ID ?? "";
    config.headers["x-app-version"] = isProd
      ? process.env.NEXT_PUBLIC_BFE_PROD_X_APP_VERSION ?? "1.0.0"
      : process.env.NEXT_PUBLIC_BFE_UAT_X_APP_VERSION ?? "1.0.0";
    config.headers["x-client-id"] = isProd
      ? process.env.NEXT_PUBLIC_BFE_PROD_X_CLIENT_ID ?? ""
      : process.env.NEXT_PUBLIC_BFE_UAT_X_CLIENT_ID ?? "";
    config.headers["x-group-code"] = isProd
      ? process.env.NEXT_PUBLIC_BFE_PROD_X_GROUP_CODE ?? ""
      : process.env.NEXT_PUBLIC_BFE_UAT_X_GROUP_CODE ?? "";
    config.headers["x-channel-code"] = isProd
      ? process.env.NEXT_PUBLIC_BFE_PROD_X_CHANNEL_CODE ?? ""
      : process.env.NEXT_PUBLIC_BFE_UAT_X_CHANNEL_CODE ?? "";

    if (typeof window !== "undefined") {
      const token = accountService.getAccessToken();
      if (token) {
        config.headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401/403 logout
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error?.response?.status;
    const requestUrl = error?.response?.config?.url?.toLowerCase() ?? "";
    const exemptPaths = ["reset-password", "forgot-password"];

    if (statusCode === 401 || statusCode === 403) {
      if (!exemptPaths.some((p) => requestUrl.includes(p)) && typeof window !== "undefined") {
        accountService.logout();
        window.dispatchEvent(new Event("auth-changed"));
      }
    } else if (statusCode === 503) {
      console.warn("[Axios] Service Unavailable", requestUrl);
    } else if (statusCode === 500) {
      console.error("[Axios] Internal Server Error", requestUrl, error?.response?.data);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
