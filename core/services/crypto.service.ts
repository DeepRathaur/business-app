/**
 * Crypto Service - AES encrypt/decrypt for localStorage (crypto-js).
 * Same secret derivation as Project B: navigator props + key for per-key encryption.
 */

import * as CryptoJS from "crypto-js";

export class CryptoService {
  private encryptSecretKey: string;

  constructor() {
    this.encryptSecretKey =
      typeof window !== "undefined"
        ? `${window.navigator.appVersion}${window.navigator.appCodeName}${window.navigator.platform}${window.navigator.vendor}${window.navigator.userAgent}`
        : "";
  }

  encryptData<T>(data: T, key: string): string | undefined {
    try {
      if (key) {
        return CryptoJS.AES.encrypt(
          JSON.stringify(data),
          `${this.encryptSecretKey}?key=${key}`
        ).toString();
      }
    } catch (e) {
      console.error("CryptoService encryptData:", e);
    }
    return undefined;
  }

  decryptData<T>(data: string, key: string): T | null {
    try {
      if (key) {
        const bytes = CryptoJS.AES.decrypt(
          data,
          `${this.encryptSecretKey}?key=${key}`
        );
        const str = bytes.toString(CryptoJS.enc.Utf8);
        if (str) return JSON.parse(str) as T;
      }
    } catch (e) {
      console.error("CryptoService decryptData:", e);
    }
    return null;
  }

  /**
   * Async encrypt for login payload (plain text string).
   * Returns Promise so useLoginFlow can use cipher.encrypt(...).then(...)
   */
  encrypt(plainText: string): Promise<string> {
    try {
      const key = `${this.encryptSecretKey}?key=login`;
      const encrypted = CryptoJS.AES.encrypt(plainText, key).toString();
      return Promise.resolve(encrypted);
    } catch (e) {
      console.error("CryptoService encrypt:", e);
      return Promise.reject(e);
    }
  }
}
