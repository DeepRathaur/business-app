/**
 * Base service for API endpoints - provides createUrl for building full URLs
 */

import { getFullUrl } from "@/core/api/config";

export abstract class BaseEndPointService {
  /** Build full API URL from path */
  protected createUrl(path: string): string {
    return getFullUrl(path);
  }
}
