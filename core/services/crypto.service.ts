/**
 * Crypto Service - Encryption for login payload
 * When encryption disabled: returns data as-is.
 * When enabled: placeholder (base64) - swap for real RSA/PEM impl as needed.
 */

import { getGlobalConfig } from "@/core/config/globalConfig";

export class CryptoService {
  async encrypt(data: string): Promise<string> {
    const isEncrypted = getGlobalConfig().encryption;
    if (!isEncrypted) {
      return Promise.resolve(data);
    }
    if (typeof window === "undefined") return data;
    try {
      return btoa(encodeURIComponent(data));
    } catch {
      return data;
    }
  }
}
