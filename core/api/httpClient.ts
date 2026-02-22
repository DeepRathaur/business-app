/**
 * HTTP Client - Centralized fetch layer with request/response interceptors
 * Uses BFE headers, auth, error handling. Works in browser and Capacitor (Android).
 */

import { getFullUrl } from "./config";
import { buildRequestHeaders } from "./requestInterceptor";
import { processErrorResponse } from "./responseInterceptor";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestConfig extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Skip auth header for public endpoints (e.g., login) */
  skipAuth?: boolean;
  /** Override Content-Type (e.g. for FormData) */
  headers?: Record<string, string>;
}

/**
 * Normalized API error for centralized handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly code?: string,
    public readonly response?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * HTTP Client - wraps fetch with request + response interceptors
 */
export async function httpClient<T>(
  path: string,
  config: RequestConfig = {}
): Promise<T> {
  const { body, skipAuth = false, headers: customHeaders = {}, ...init } = config;

  const url = path.startsWith("http") ? path : getFullUrl(path);

  const baseHeaders = buildRequestHeaders({ skipAuth, headers: customHeaders });

  const isFormData = body instanceof FormData;
  if (isFormData) {
    delete baseHeaders["Content-Type"];
  } else if (
    body !== undefined &&
    typeof body === "object" &&
    !baseHeaders["Content-Type"]
  ) {
    baseHeaders["Content-Type"] = "application/json";
  }

  const fetchConfig: RequestInit = {
    ...init,
    headers: baseHeaders,
    body:
      body !== undefined && !isFormData && typeof body === "object"
        ? JSON.stringify(body)
        : (body as BodyInit | undefined),
  };

  const response = await fetch(url, fetchConfig);
  const contentType = response.headers.get("Content-Type") ?? "";
  let parsed: unknown;

  try {
    parsed = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
  } catch {
    parsed = null;
  }

  if (!response.ok) {
    const payload = processErrorResponse(response, parsed);
    throw new ApiError(
      payload.message,
      payload.statusCode,
      payload.code,
      payload.response
    );
  }

  return parsed as T;
}
