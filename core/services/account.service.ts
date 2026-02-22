/**
 * Account Service - Token and user state
 * Uses LocalStorage service. No direct localStorage access elsewhere.
 */

import type { TransactionInfoModel } from "@/shared/models";
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

  setAuuid(auuid: string): void {
    localStorageService.set(LocalStorageKey.AUU_NUMBERID, auuid);
  }

  getAuuid(): string | null {
    return localStorageService.get<string>(LocalStorageKey.AUU_NUMBERID);
  }

  setPermission(permission: unknown[]): void {
    localStorageService.set(LocalStorageKey.UMS_PERMISSION, permission);
  }

  getPermission(): unknown[] {
    const data = localStorageService.get(LocalStorageKey.UMS_PERMISSION);
    return Array.isArray(data) ? data : [];
  }

  setServiceType(serviceType: string[]): void {
    localStorageService.set(LocalStorageKey.SERVICE_TYPE, serviceType);
  }

  setEnterPriseRole(role: string): void {
    localStorageService.set(LocalStorageKey.ENTERPRISE_ROLE, role);
  }

  getEnterPriseRole(): string | null {
    return localStorageService.get<string>(LocalStorageKey.ENTERPRISE_ROLE);
  }

  setConfigurationLayout(data: unknown): void {
    localStorageService.set(LocalStorageKey.LAYOUT_CONF, data);
  }

  getConfigurationLayout(): unknown {
    return localStorageService.get(LocalStorageKey.LAYOUT_CONF);
  }

  setTxnInfo(txnInfo: TransactionInfoModel): void {
    localStorageService.set(LocalStorageKey.TXN_INFO, txnInfo);
  }

  getTxnInfo(): TransactionInfoModel | null {
    return localStorageService.get<TransactionInfoModel>(LocalStorageKey.TXN_INFO);
  }

  setUMSPermission(permissions: string[]): void {
    localStorageService.set(LocalStorageKey.UMS_PERMISSION, permissions);
  }

  isUserLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    localStorageService.remove(LocalStorageKey.ACCESS_TOKEN);
    localStorageService.remove(LocalStorageKey.USER);
    localStorageService.remove(LocalStorageKey.LOGIN_TIME);
    localStorageService.remove(LocalStorageKey.AUU_NUMBERID);
    localStorageService.remove(LocalStorageKey.UMS_PERMISSION);
    localStorageService.remove(LocalStorageKey.SERVICE_TYPE);
    localStorageService.remove(LocalStorageKey.ENTERPRISE_ROLE);
    localStorageService.remove(LocalStorageKey.LAYOUT_CONF);
    localStorageService.remove(LocalStorageKey.TXN_INFO);
  }
}

export const accountService = new AccountService();
