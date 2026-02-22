"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { LocalStorageKey } from "@/core/constants/localStorage.enum";
import { getGlobalConfig } from "@/core/config/globalConfig";
import { localStorageService } from "@/core/services/localStorage.service";
import { fetchLocaleFromApi } from "@/core/services/language.service";
import { staticLocales } from "@/lib/locales/static";

type Translations = Record<string, unknown>;

interface LocaleContextValue {
  t: (key: string) => string;
  changeLanguage: (lang: string) => void;
  currentLanguage: string;
  translations: Translations | null;
  loading: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getNested(obj: unknown, path: string): string | null {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const k of keys) {
    if (current === null || current === undefined) return null;
    current = (current as Record<string, unknown>)[k];
  }
  return typeof current === "string" ? current : null;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const config = getGlobalConfig();
  // Use same initial state on server and client to avoid hydration mismatch.
  // localStorage is read in useEffect (client-only) after hydration.
  const [currentLanguage, setCurrentLanguage] = useState<string>(config.defaultLanguage);
  const [translations, setTranslations] = useState<Translations | null>(
    () => staticLocales[config.defaultLanguage] ?? staticLocales.en ?? {}
  );
  const [loading, setLoading] = useState(false); // Don't block UI; locale API runs in background
  const [apiLoaded, setApiLoaded] = useState(false);

  const staticData = useMemo(
    () => staticLocales[currentLanguage] ?? staticLocales.en ?? {},
    [currentLanguage]
  );

  const displayTranslations = apiLoaded ? translations : staticData;

  const loadTranslationsFromApi = useCallback(async (lang: string) => {
    setLoading(true);
    try {
      const langToUse = lang || config.defaultLanguage;
      const apiData = await fetchLocaleFromApi(langToUse);
      if (apiData && typeof apiData === "object") {
        setTranslations(apiData);
        setApiLoaded(true);
      } else {
        const fallback = staticLocales[langToUse] ?? staticLocales.en ?? {};
        setTranslations(fallback);
        setApiLoaded(true);
      }
      setCurrentLanguage(langToUse);
      localStorageService.set(LocalStorageKey.LANGUAGE, langToUse);
    } catch {
      const fallback = staticLocales[config.defaultLanguage] ?? staticLocales.en ?? {};
      setTranslations(fallback);
      setApiLoaded(true);
      setCurrentLanguage(config.defaultLanguage);
    } finally {
      setLoading(false);
    }
  }, [config.defaultLanguage]);

  const t = useCallback(
    (key: string): string => {
      const data = displayTranslations;
      if (!data || typeof data !== "object") return key;
      const val = getNested(data, key);
      return val ?? key;
    },
    [displayTranslations]
  );

  const changeLanguage = useCallback(
    (lang: string) => {
      localStorageService.set(LocalStorageKey.LANGUAGE, lang);
      setCurrentLanguage(lang);
      setTranslations(staticLocales[lang] ?? staticLocales.en ?? {});
      loadTranslationsFromApi(lang);
    },
    [loadTranslationsFromApi]
  );

  // Fetch locale from API in background; defer until after first paint so UI renders immediately
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const stored = localStorageService.get<string>(LocalStorageKey.LANGUAGE);
      const langToUse = stored ?? config.defaultLanguage;
      setCurrentLanguage(langToUse);
      setTranslations(staticLocales[langToUse] ?? staticLocales.en ?? {});
      loadTranslationsFromApi(langToUse);
    });
    return () => cancelAnimationFrame(id);
  }, [config.defaultLanguage, loadTranslationsFromApi]);

  const value = useMemo(
    () => ({ t, changeLanguage, currentLanguage, translations: displayTranslations, loading }),
    [t, changeLanguage, currentLanguage, displayTranslations, loading]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
