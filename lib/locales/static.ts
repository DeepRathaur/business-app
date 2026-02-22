/**
 * Static locale JSON - bundled at build time, no fetch.
 * Used as initial translations until locale API resolves.
 */

import en from "@/public/locales/en.json";
import fr from "@/public/locales/fr.json";

export const staticLocales: Record<string, Record<string, unknown>> = {
  en: en as Record<string, unknown>,
  fr: fr as Record<string, unknown>,
};
