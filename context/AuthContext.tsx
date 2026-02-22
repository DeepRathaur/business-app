"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { setAuthTokenProvider, clearAuthTokenProvider } from "@/core/api";
import { accountService } from "@/core/services/account.service";

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const getToken = useCallback((): string | null => {
    return accountService.getAccessToken();
  }, []);

  const login = useCallback((newToken: string) => {
    accountService.setAccessToken(newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    accountService.logout();
    setToken(null);
    clearAuthTokenProvider();
  }, []);

  useEffect(() => {
    const stored = accountService.getAccessToken();
    if (stored) setToken(stored);
    setInitialized(true);
  }, []);

  useEffect(() => {
    const handleAuthChanged = () => {
      const t = accountService.getAccessToken();
      setToken(t);
    };
    window.addEventListener("auth-changed", handleAuthChanged);
    return () => window.removeEventListener("auth-changed", handleAuthChanged);
  }, []);

  useEffect(() => {
    setAuthTokenProvider(getToken);
    return () => clearAuthTokenProvider();
  }, [getToken]);

  const value = useMemo<AuthContextValue>(
    () => ({
      token: initialized ? token ?? getToken() : null,
      isAuthenticated: !!(initialized && (token ?? getToken())),
      login,
      logout,
      getToken,
    }),
    [token, initialized, login, logout, getToken]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
