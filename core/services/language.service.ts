/**
 * Language Service - Fetch translations from API with fallback to local JSON
 * Uses LanguageService (POST via axiosClient). Used by LocaleContext.
 */

import { LanguageService } from "./LanguageService";
import { ResponseCodeEnum } from "@/shared/enum";

export interface LocaleApiResponse {
  statusCode?: string;
  result?: { data?: Record<string, unknown> };
  message?: string;
}

/**
 * Fetch locale from API via POST (axiosClient + interceptor).
 * Returns null on failure (caller should fallback to local).
 */
export async function fetchLocaleFromApi(
  lang: string
): Promise<Record<string, unknown> | null> {
  try {
    const service = new LanguageService();
    const response = (await service.fetchLocale(lang)) as LocaleApiResponse;
    if (response?.statusCode === ResponseCodeEnum.SUCCESS && response?.result?.data) {
      return response.result.data as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}
