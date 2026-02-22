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
const BFE_WEB = "/bfe/web";

export function getGlobalConfig(): GlobalConfig {
  if (!instance) {
    // Use proxy when on localhost to avoid CORS (env opt-in, or auto when page is localhost)
    const isLocalhost =
      typeof window !== "undefined" &&
      /^https?:\/\/localhost(:\d+)?$/.test(window.location.origin);
    const useCorsProxy =
      (process.env.NEXT_PUBLIC_USE_CORS_PROXY === "true" || isLocalhost) &&
      typeof window !== "undefined";
    const prefix = process.env.NEXT_PUBLIC_PROJECT_PREFIX ?? "";
    const customBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    let base =
      customBase ??
      (prefix ? `${prefix}${BFE_WEB}` : "https://api.example.com");

    // Dev workaround: proxy API via same-origin to avoid CORS (Chrome blocks, Postman works)
    if (useCorsProxy) {
      base = `${window.location.origin}/cors-proxy${BFE_WEB}`;
    } else if (!base.includes("/bfe/web")) {
      base = base.replace(/\/?$/, "") + BFE_WEB;
    }

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
