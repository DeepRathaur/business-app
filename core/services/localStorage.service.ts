/**
 * LocalStorage Service - Typed, reusable, testable
 * Optional AES encryption when NEXT_PUBLIC_ENCRYPTION=true (via CryptoService / crypto-js).
 */

import { LocalStorageKey } from "@/core/constants/localStorage.enum";
import { CryptoService } from "./crypto.service";

class LocalStorageService {
  private _crypto = new CryptoService();
  private _isEncrypted =
    typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_ENCRYPTION === "true";

  set<T>(key: LocalStorageKey, value: T): void {
    if (typeof window === "undefined") return;
    try {
      const storedValue = this._isEncrypted
        ? this._crypto.encryptData(value, key) ?? ""
        : JSON.stringify(value);

      localStorage.setItem(key, storedValue);
    } catch (e) {
      console.error(`LocalStorage set failed for key "${key}":`, e);
    }
  }

  get<T>(key: LocalStorageKey): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;

      if (this._isEncrypted) {
        const decrypted = this._crypto.decryptData<T>(raw, key);
        return decrypted;
      }

      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as unknown as T;
      }
    } catch (e) {
      console.error(`LocalStorage get failed for key "${key}":`, e);
      return null;
    }
  }

  remove(key: LocalStorageKey): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`LocalStorage remove failed for key "${key}":`, e);
    }
  }

  /** Alias for remove (matches Project B API) */
  clearItem(key: LocalStorageKey): void {
    this.remove(key);
  }

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.clear();
    } catch (e) {
      console.error("LocalStorage clear failed:", e);
    }
  }

  /** Alias for clear (matches Project B API) */
  clearAll(): void {
    this.clear();
  }
}

export const localStorageService = new LocalStorageService();
