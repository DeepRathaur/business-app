/**
 * LocalStorage Service - Typed, reusable, testable
 * Single responsibility: persist/retrieve from localStorage.
 */

import { LocalStorageKey } from "@/core/constants/localStorage.enum";

class LocalStorageService {
  set<T>(key: LocalStorageKey, value: T): void {
    if (typeof window === "undefined") return;
    try {
      const serialized = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (e) {
      console.error(`LocalStorage set failed for key "${key}":`, e);
    }
  }

  get<T>(key: LocalStorageKey): T | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return null;
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

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.clear();
    } catch (e) {
      console.error("LocalStorage clear failed:", e);
    }
  }
}

export const localStorageService = new LocalStorageService();
