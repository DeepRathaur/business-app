/**
 * Account Service - Token and user state
 * Uses LocalStorage service. No direct localStorage access elsewhere.
 */

import { LocalStorageKey } from "@/core/constants/localStorage.enum";
import { localStorageService } from "./localStorage.service";

export interface StoredUser {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

class AccountService {
  setAccessToken(token: string): void {
    localStorageService.set(LocalStorageKey.ACCESS_TOKEN, token);
  }

  getAccessToken(): string | null {
    return localStorageService.get<string>(LocalStorageKey.ACCESS_TOKEN);
  }

  setUser(user: StoredUser): void {
    localStorageService.set(LocalStorageKey.USER, user);
  }

  getUser(): StoredUser | null {
    return localStorageService.get<StoredUser>(LocalStorageKey.USER);
  }

  isUserLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    localStorageService.remove(LocalStorageKey.ACCESS_TOKEN);
    localStorageService.remove(LocalStorageKey.USER);
    localStorageService.remove(LocalStorageKey.LOGIN_TIME);
  }
}

export const accountService = new AccountService();
