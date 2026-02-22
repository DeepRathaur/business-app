/**
 * Global Config Loader - Singleton pattern
 * Load once at app startup. Stores API base URL, feature flags, default language.
 */

export interface GlobalConfig {
  /** API base URL (e.g., https://abcliteuat.airtel.com.ng/bfe/web) */
  apiBaseUrl: string;
  /** Default language when none stored */
  defaultLanguage: string;
  /** Enable UMS2 API variant */
  enableUms2: boolean;
  /** Enable encryption for sensitive data */
  encryption: boolean;
}

let instance: GlobalConfig | null = null;

/**
 * Returns singleton config. Loads from env once.
 */
export function getGlobalConfig(): GlobalConfig {
  if (!instance) {
    const prefix = process.env.NEXT_PUBLIC_PROJECT_PREFIX ?? "";
    const customBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    const base =
      customBase ??
      (prefix ? `${prefix}/bfe/web` : "https://api.example.com");
    instance = {
      apiBaseUrl: base.endsWith("/") ? base.slice(0, -1) : base,
      defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? "en",
      enableUms2: process.env.NEXT_PUBLIC_ENABLE_UMS2 === "true",
      encryption: process.env.NEXT_PUBLIC_ENCRYPTION === "true",
    };
  }
  return instance;
}

/**
 * Reset config (e.g., for tests)
 */
export function resetGlobalConfig(): void {
  instance = null;
}
