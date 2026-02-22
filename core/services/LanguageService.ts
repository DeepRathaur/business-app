/**
 * LanguageService - Fetch locale labels from API
 * Uses POST via axiosClient with key and locale headers, empty body {}.
 */

import axiosClient from "@/core/api/axiosClient";
import { ConfigurationUrls } from "@/core/constants/api-urls";
import { BaseEndPointService } from "./BaseEndPointService";

export class LanguageService extends BaseEndPointService {
  async fetchLocale(locale: string): Promise<unknown> {
    const url = this.createUrl(ConfigurationUrls.LOCALE);
    const config = {
      headers: {
        key: process.env.NEXT_PUBLIC_LOCALE_KEY ?? "frontend_locale_labels_test",
        locale,
      },
    };
    const response = await axiosClient.post<unknown>(url, {}, config);
    return response.data;
  }
}
