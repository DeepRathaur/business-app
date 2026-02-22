/**
 * ConfigurationService - Load app configuration from database
 * Uses POST via axiosClient with caching.
 */

import axiosClient from "@/core/api/axiosClient";
import { ConfigurationUrls } from "@/core/constants/api-urls";
import { cacheService } from "./cache.service";
import { BaseEndPointService } from "./BaseEndPointService";
import type { ResponseAppConfiguration } from "@/shared/models";

export class ConfigurationService extends BaseEndPointService {
  async fetchConfiguration(
    product: string,
    type: string
  ): Promise<ResponseAppConfiguration> {
    const url = this.createUrl(ConfigurationUrls.CONFIG);
    const cacheKey = `config_${product}`;

    const cached = cacheService.get<ResponseAppConfiguration>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await axiosClient.post<ResponseAppConfiguration>(url, {
      product,
      type,
    });

    cacheService.set(cacheKey, response.data);
    return response.data;
  }
}
