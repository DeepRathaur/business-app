/**
 * LocalStorage keys - Centralized enum. No magic strings.
 */

export enum LocalStorageKey {
  /** Access token for authenticated API calls */
  ACCESS_TOKEN = "ACCESS_LITE_TOK_EN",
  /** Selected language code (e.g., en, fr) */
  LANGUAGE = "app_language",
  /** Account number for default selection */
  ACCOUNT_NO = "ACCOUNT_NO",
  /** User object */
  USER = "USER",
  /** Login timestamp */
  LOGIN_TIME = "LOGIN_TIME",
  /** Feature flags / layout config - extend as needed */
  LAYOUT_CONF = "LAYOUT_CONF",
}
