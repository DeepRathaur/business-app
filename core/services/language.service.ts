/**
 * Language Service - Fetch translations from API with fallback to local JSON
 * No UI logic. Used by LocaleContext.
 */

import { getGlobalConfig } from "@/core/config/globalConfig";
import { ConfigurationUrls } from "@/core/constants/api-urls";

export interface LocaleApiResponse {
  statusCode?: string;
  result?: { data?: Record<string, unknown> };
  message?: string;
}

function buildUrl(path: string, query?: string): string {
  const config = getGlobalConfig();
  const base = config.apiBaseUrl.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${base}${cleanPath}`;
  return query ? `${url}?${query}` : url;
}

/**
 * Fetch locale from API. Returns null on failure (caller should fallback to local).
 */
export async function fetchLocaleFromApi(
  lang: string
): Promise<Record<string, unknown> | null> {
  try {
    const query = new URLSearchParams({
      locale: lang,
      key: process.env.NEXT_PUBLIC_LOCALE_KEY ?? "frontend_locale_labels_test",
    }).toString();
    const url = buildUrl(ConfigurationUrls.LOCALE, query);
    const res = await fetch(url);
    const json = (await res.json()) as LocaleApiResponse;
    if (json?.statusCode === "SUCCESS" && json?.result?.data) {
      return json.result.data as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}
