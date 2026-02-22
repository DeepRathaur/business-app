/**
 * Response / Error Interceptor - Centralized error handling
 * Handles 401/403 → logout, 503/500 logging. Works in browser and Capacitor.
 */

import { accountService } from "@/core/services/account.service";

/** Paths that should NOT trigger logout on 401/403 */
const LOGOUT_EXEMPT_PATHS = ["reset-password", "forgot-password"];

function isLogoutExempt(url: string): boolean {
  const lower = url.toLowerCase();
  return LOGOUT_EXEMPT_PATHS.some((p) => lower.includes(p));
}

/**
 * Handles HTTP error response. Logs, optionally logs out on 401/403.
 * Call this before throwing - it does not throw.
 */
export function handleErrorResponse(
  statusCode: number,
  url: string,
  body?: unknown
): void {
  if (statusCode === 401 || statusCode === 403) {
    if (!isLogoutExempt(url) && typeof window !== "undefined") {
      accountService.logout();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-changed"));
      }
    }
  } else if (statusCode === 503) {
    console.warn("[API] Service Unavailable", url);
  } else if (statusCode === 500) {
    console.error("[API] Internal Server Error", url, body);
  }
}

export interface ErrorPayload {
  message: string;
  statusCode: number;
  code?: string;
  response?: unknown;
}

/**
 * Process failed fetch response - run error handler, return payload for ApiError
 */
export function processErrorResponse(
  response: Response,
  parsedBody: unknown
): ErrorPayload {
  const url = response.url ?? "";
  handleErrorResponse(response.status, url, parsedBody);

  const message =
    typeof parsedBody === "object" &&
    parsedBody !== null &&
    "message" in parsedBody
      ? String((parsedBody as { message: unknown }).message)
      : response.statusText || "Request failed";

  const code =
    typeof parsedBody === "object" &&
    parsedBody !== null &&
    "statusCode" in parsedBody
      ? String((parsedBody as { statusCode: unknown }).statusCode)
      : undefined;

  return {
    message,
    statusCode: response.status,
    code,
    response: parsedBody,
  };
}
