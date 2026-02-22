/**
 * Auth Service Factory - Dependency Injection
 * Single place to create/configure AuthService. Swap implementation here.
 */

import { AuthService } from "./auth.service";
import { AuthServiceMock } from "./auth.service.mock";

let instance: AuthService | AuthServiceMock | null = null;

export type AuthServiceFactoryConfig = {
  enableUms2?: boolean;
};

const USE_MOCK =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_MOCK_AUTH === "true";

/**
 * Returns singleton AuthService. Uses mock when NEXT_PUBLIC_MOCK_AUTH=true.
 */
export function getAuthService(
  config?: AuthServiceFactoryConfig
): AuthService | AuthServiceMock {
  if (!instance) {
    instance = USE_MOCK
      ? new AuthServiceMock()
      : new AuthService(config ?? { enableUms2: false });
  }
  return instance;
}

/**
 * For tests: reset singleton to allow new config.
 */
export function resetAuthService(): void {
  instance = null;
}
