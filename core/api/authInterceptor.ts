/**
 * Auth Interceptor - Attaches token to outgoing requests
 * Single responsibility: inject Authorization header when token exists
 */

export type TokenProvider = () => string | null;

let tokenProvider: TokenProvider | null = null;

/**
 * Registers the token provider (e.g., from AuthContext).
 * Called once when app initializes.
 */
export function setAuthTokenProvider(provider: TokenProvider): void {
  tokenProvider = provider;
}

/**
 * Clears the token provider (e.g., on logout).
 */
export function clearAuthTokenProvider(): void {
  tokenProvider = null;
}

/**
 * Returns headers with Authorization if token is available.
 */
export function attachAuthHeaders(baseHeaders: HeadersInit = {}): HeadersInit {
  const headers =
    baseHeaders instanceof Headers
      ? new Headers(baseHeaders)
      : new Headers(baseHeaders as Record<string, string>);

  const token = tokenProvider?.();
  if (token) {
    headers.set("Authorization", token.startsWith("Bearer ") ? token : `Bearer ${token}`);
  }
  return headers;
}
