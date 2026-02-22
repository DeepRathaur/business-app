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

type Translations = Record<string, unknown>;

interface LocaleContextValue {
  t: (key: string) => string;
  changeLanguage: (lang: string) => void;
  currentLanguage: string;
  translations: Translations | null;
  loading: boolean;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

async function loadLocalJson(lang: string): Promise<Translations> {
  const res = await fetch(`/locales/${lang}.json`);
  if (!res.ok) return {};
  return (await res.json()) as Translations;
}

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
  const [currentLanguage, setCurrentLanguage] = useState<string>(config.defaultLanguage);
  const [translations, setTranslations] = useState<Translations | null>(null);
  const [loading, setLoading] = useState(true);
  const [cache, setCache] = useState<Record<string, Translations>>({});

  const loadLocal = useCallback(async (lang: string): Promise<Translations> => {
    return loadLocalJson(lang === "fr" ? "fr" : "en");
  }, []);

  const loadTranslations = useCallback(
    async (lang: string) => {
      setLoading(true);
      try {
        const langToUse = lang || config.defaultLanguage;

        const apiData = await fetchLocaleFromApi(langToUse);
        let data: Translations;

        if (apiData && typeof apiData === "object") {
          data = apiData;
          setCache((c) => ({ ...c, [langToUse]: data }));
        } else {
          data = (await loadLocal(langToUse)) ?? {};
          setCache((c) => ({ ...c, [langToUse]: data }));
        }

        setTranslations(data);
        setCurrentLanguage(langToUse);
        localStorageService.set(LocalStorageKey.LANGUAGE, langToUse);
      } catch {
        const fallback = (await loadLocal(config.defaultLanguage)) ?? {};
        setTranslations(fallback);
        setCurrentLanguage(config.defaultLanguage);
      } finally {
        setLoading(false);
      }
    },
    [config.defaultLanguage, loadLocal]
  );

  const t = useCallback(
    (key: string): string => {
      if (!translations) return key;
      const val = getNested(translations, key);
      return val ?? key;
    },
    [translations]
  );

  const changeLanguage = useCallback(
    (lang: string) => {
      localStorageService.set(LocalStorageKey.LANGUAGE, lang);
      loadTranslations(lang);
    },
    [loadTranslations]
  );

  useEffect(() => {
    const stored = localStorageService.get<string>(LocalStorageKey.LANGUAGE);
    loadTranslations(stored ?? config.defaultLanguage);
  }, [config.defaultLanguage, loadTranslations]);

  const value = useMemo(
    () => ({ t, changeLanguage, currentLanguage, translations, loading }),
    [t, changeLanguage, currentLanguage, translations, loading]
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
