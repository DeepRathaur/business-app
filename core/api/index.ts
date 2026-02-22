/**
 * Core API - Public exports
 */

export { httpClient, ApiError, type RequestConfig } from "./httpClient";
export { buildRequestHeaders } from "./requestInterceptor";
export { handleErrorResponse, processErrorResponse } from "./responseInterceptor";
export { attachAuthHeaders, setAuthTokenProvider, clearAuthTokenProvider } from "./authInterceptor";
export { getApiBaseUrl, getFullUrl, API_ENDPOINTS } from "./config";
